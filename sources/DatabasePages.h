#ifndef DATABASE_H
#define DATABASE_H

#include <string>
#include <pqxx/pqxx> // Изменяем заголовок
#include <nlohmann/json.hpp>
#include "ConnectDataBaze.h"

using json = nlohmann::json;

class Database {
    pqxx::connection connect = connection_data_baze(); // Меняем PGconn* на pqxx::connection

    
public:
std::string escapeString(const std::string& input);
    void execute(const std::string& query);
    nlohmann::json execQuery(const std::string& query);

    //Database() ;
    //~Database() = default; // Деструктор больше не нужен
    nlohmann::json getCurrentObjects();
    nlohmann::json getViewsForObjects();
};

#endif // DATABASE_H
