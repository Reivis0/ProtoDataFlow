#include "DatabasePages.h"
#include <iostream>
#include <stdexcept>
#include <pqxx/pqxx>

std::string Database::escapeString(const std::string& input) {
    return connect.quote(input);
}

void Database::execute(const std::string& query) {
    pqxx::work txn(connect);
    try {
        txn.exec(query);
        txn.commit();
    }
    catch (const pqxx::sql_error& e) {
        throw std::runtime_error("Database error: " + std::string(e.what()) +
            "\nQuery: " + query);
    }
}

nlohmann::json Database::execQuery(const std::string& query) {
    pqxx::work txn(connect);
    nlohmann::json result = nlohmann::json::array();
    
    try {
        auto res = txn.exec(query);
        
        for (const auto& row : res) {
            nlohmann::json jrow;
            for (const auto& field : row) {
                if (field.is_null()) {
                    jrow[field.name()] = nullptr;
                } else {
                    // Правильная проверка типов через шаблонные функции pqxx
                    try {
                        // Пробуем получить как целое число
                        jrow[field.name()] = field.as<int>();
                    } catch (const pqxx::conversion_error&) {
                        try {
                            // Пробуем получить как число с плавающей точкой
                            jrow[field.name()] = field.as<double>();
                        } catch (const pqxx::conversion_error&) {
                            // Если не число, то как строку
                            jrow[field.name()] = field.as<std::string>();
                        }
                    }
                }
            }
            result.push_back(jrow);
        }
        
        txn.commit();
    } catch (const pqxx::sql_error& e) {
        throw std::runtime_error("Database error: " + std::string(e.what()));
    }
    
    return result;
}


nlohmann::json Database::getCurrentObjects() {
    auto result = execQuery(R"(
        SELECT o.name, COALESCE(t.name, '') as type 
        FROM objects o 
        LEFT JOIN object_types t ON o.type_id = t.id
    )");

    nlohmann::json output = {
        {"Objects", nlohmann::json::array()},
        {"Types", nlohmann::json::array()},
        {"data", nlohmann::json::object()},
        {"Settings", nlohmann::json::array()}
    };

    for (const auto& row : result) {
        output["Objects"].push_back(row["name"]);
        if (!row["type"].is_null() && !row["type"].get<std::string>().empty()) {
            output["data"][row["name"]] = std::stoi(row["type"].get<std::string>().substr(4));
        }
        else {
            output["data"][row["name"]] = nullptr;
        }
    }

    auto types = execQuery("SELECT name FROM object_types");
    for (const auto& type : types) {
        std::string typeName = type["name"];
        int typeNum = std::stoi(typeName.substr(4));
        output["Types"].push_back({ {"num", typeNum}, {"name", typeName} });
    }

    for (int i = 0; i < 12; ++i) {
        output["Settings"].push_back({ {"PM", true}, {"example", false} });
    }

    return output;
}

nlohmann::json Database::getViewsForObjects() {
    auto result = execQuery(R"(
        SELECT v.number, v.header, v.code, 
               c.number as comp_number, c.name as comp_name, c.code as comp_code 
        FROM views v 
        JOIN components c ON v.id = c.view_id 
        JOIN objects o ON v.object_id = o.id 
        WHERE v.enabled = TRUE AND c.enabled = TRUE 
        ORDER BY v.number, c.number
    )");

    nlohmann::json output = nlohmann::json::array();
    for (const auto& row : result) {
        nlohmann::json view = {
            {"number", row["number"]},
            {"header", row["header"]},
            {"code", row["code"]},
            {"components", nlohmann::json::array()}
        };

        nlohmann::json component = {
            {"number", row["comp_number"]},
            {"name", row["comp_name"]},
            {"code", row["comp_code"]}
        };

        view["components"].push_back(component);
        output.push_back(view);
    }

    return output;
}
