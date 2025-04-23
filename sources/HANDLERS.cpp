#include "HANDLERS.h"

pqxx::connection conn = connection_data_baze();

http::response<http::string_body> handle_request(const http::request<http::string_body>& req) 
{
    log("handler request");
    http::response<http::string_body> res;

    if (req.method() == http::verb::options) {
        res.result(http::status::ok);
        res.set(http::field::access_control_allow_methods, "POST, OPTIONS");
        res.set(http::field::access_control_allow_headers, "Content-Type");
        res.set(http::field::access_control_allow_origin, "*");
        res.prepare_payload();
        return res;
    }

    if (req.method() == http::verb::post && req.target() == "/api/auth")
        do_authentication(req, res);
    else if (req.method() == http::verb::post && req.target() == "/api/agree")
        add_info_agreement(req, res);
    else if(req.method() == http::verb::post && req.target() == "/api/getuserinfo") // получение базы пользователей
        get_users_info(req, res);
    else if(req.method() == http::verb::post && req.target() == "/api/choosepages") // занесение выбора страниц
        update_pages(req, res);
    else if(req.method() == http::verb::post && req.target() == "/api/chooseobjects") // занесение выбора объектов
    update_objects(req, res);
    else if(req.method() == http::verb::get && req.target() == "/api/getviews") // получение представлений
        get_views(req, res);

    else throw std::invalid_argument(INVALID_METHOD);
    
    res.prepare_payload();
    return res;
}

void do_authentication(const http::request<http::string_body>& req, http::response<http::string_body>& res)
{
    log("post request authentication");
    
    auto json_request = nlohmann::json::parse(req.body());
    std::string login = json_request.at("login");
    std::string password = json_request.at("password");
        
    log("parametrs are geted");
    
     
    log("start of user search\n");  
    std::tuple<std::string,bool, bool, std::string> result = find_user(conn, login, password);
    log("find user is finaled");

    nlohmann::json result_json = {{"status",std::get<0>(result)},{"agreement", std::get<1>(result)}, {"access",std::get<2>(result)}, {"privilege", std::get<3>(result)}};
    res.result(http::status::ok);
    res.body() = result_json.dump();
    log("responce authentication prepared");
}
void add_info_agreement(const http::request<http::string_body>& req, http::response<http::string_body>& res)
{
    log("post request ageements");

    auto json_request = nlohmann::json::parse(req.body());
    std::string login_ = json_request.at("login");
    std::string surname_ = json_request.at("surname");
    std::string name_ = json_request.at("name");
    std::string patronymic_ = json_request.at("patronymic");
    
    log("parametrs are geted");

    std::vector<std::tuple<std::string, std::string>> data;
    data.push_back({"Login_", login_});
    data.push_back({"Name_",name_});
    data.push_back({"Surname_",surname_});
    data.push_back({"Patronymic_",patronymic_});
    data.push_back({"AgreementPersonal_","true"});
    data.push_back({"AgreementUse_","true"});
    nlohmann::json result_json;
    if(processing_agreement(conn, login_))  
    {
        result_json = {{"process", true}};
        add_info_into_agreement_baze(conn, data);
    }
    else result_json = {{"process", false}};
    res.body() = result_json.dump();
    log("response agreement prepared");
}

void get_users_info(const http::request<http::string_body>& req, http::response<http::string_body>& res)
{
    log("post request get users' info");

    auto json_request = nlohmann::json::parse(req.body());
    std::string user_status = json_request.at("status");
    std::vector<User_info> info;
    get_info_from_user_info(conn, user_status, info);
    get_info_from_user_agreement(conn, info);

    nlohmann::json result_json;
    for(const auto el : info)
        result_json.push_back({{"login", el.login}, {"password", el.password}, {"surname", el.surname}, {"name", el.name}, {"patronymic", el.patronymic}, {"access", el.access}, 
                                {"start date", el.start_date}, {"end date", el.end_date}, {"email", el.email}, {"telephone", el.telephone}, {"comments", el.comments}});

    res.body() = result_json.dump();
    log("response users info prepared");
}


//хуй знает не мое
void update_pages(const http::request<http::string_body>& req, http::response<http::string_body>& res) {
    log("post request update_pages");

    Database db;
    auto json_request = nlohmann::json::parse(req.body());

    std::ofstream tmpFile("toServerPagesEnable.json");
    tmpFile << json_request.dump();
    tmpFile.close();

    handlePagesJson(db, "toServerPagesEnable.json");

    res.result(http::status::ok);
    res.body() = nlohmann::json{ {"status", "success"} }.dump();
    log("update_pages completed");
}

void update_objects(const http::request<http::string_body>& req, http::response<http::string_body>& res) {
    log("post request update_objects");

    Database db;
    auto json_request = nlohmann::json::parse(req.body());

    std::ofstream tmpFile("toServerObjects.json");
    tmpFile << json_request.dump();
    tmpFile.close();

    handleObjectsJson(db, "toServerObjects.json");
    nlohmann::json currentObjects = db.getCurrentObjects();

    res.result(http::status::ok);
    res.body() = currentObjects.dump();
    log("update_objects completed");
}

void get_views(const http::request<http::string_body>& req, http::response<http::string_body>& res) {
    log("get request get_views");

    Database db;
    nlohmann::json currentViews = db.getViewsForObjects();

    res.result(http::status::ok);
    res.body() = currentViews.dump();
    log("get_views completed");
}
void handlePagesJson(Database& db, const std::string& jsonPath) {
    std::ifstream pagesFile(jsonPath);
    if (!pagesFile.is_open()) {
        throw std::runtime_error("Failed to open pages JSON file");
    }

    nlohmann::json pagesData = nlohmann::json::parse(pagesFile);

    db.execute("BEGIN");
    try {
        // 1. Process object types from pages JSON
        for (size_t i = 0; i < pagesData["ObjectTypes"].size(); ++i) {
            bool enabled = pagesData["ObjectTypes"][i]["enabled"];
            std::string typeName = "Type" + std::to_string(i + 1);
            std::string pageName = "ObjectType_" + std::to_string(i + 1);

            // Insert or update object type
            db.execute("INSERT INTO object_types (name) VALUES (" + 
                     db.escapeString(typeName) + ") ON CONFLICT (name) DO NOTHING");

            // Insert or update page
            db.execute("INSERT INTO pages (name, enabled) VALUES (" + 
                     db.escapeString(pageName) + ", " + 
                     (enabled ? "TRUE" : "FALSE") + ") ON CONFLICT (name) DO UPDATE SET enabled = EXCLUDED.enabled");
        }

        // 2. Process views and components from pagesData
        if (pagesData.contains("Views")) {
            // Get the first object_id for the views
            auto objRes = db.execQuery("SELECT id FROM objects LIMIT 1");
            if (objRes.empty()) {
                throw std::runtime_error("No objects found to associate views with");
            }
            int object_id = objRes[0]["id"].get<int>();

            // Disable all existing views for this object instead of deleting
            db.execute("UPDATE views SET enabled = FALSE WHERE object_id = " + std::to_string(object_id));

            for (size_t i = 0; i < pagesData["Views"].size(); ++i) {
                const auto& viewData = pagesData["Views"][i];
                int viewNumber = i + 1;
                std::string header = viewData["name"].is_null() ? "" : viewData["name"].get<std::string>();
                bool enabled = viewData["enabled"].get<bool>();

                // Insert or update view with ON CONFLICT
                db.execute("INSERT INTO views (object_id, number, header, enabled) VALUES (" +
                         std::to_string(object_id) + ", " +
                         std::to_string(viewNumber) + ", " +
                         db.escapeString(header) + ", " +
                         (enabled ? "TRUE" : "FALSE") + ") " +
                         "ON CONFLICT (object_id, number) DO UPDATE SET " +
                         "header = EXCLUDED.header, enabled = EXCLUDED.enabled");

                // Get the view_id for the components
                auto viewRes = db.execQuery("SELECT id FROM views WHERE object_id = " + 
                                         std::to_string(object_id) + " AND number = " + 
                                         std::to_string(viewNumber));
                if (viewRes.empty()) {
                    throw std::runtime_error("Failed to retrieve view_id for components");
                }
                int view_id = viewRes[0]["id"].get<int>();

                // Disable all existing components for this view
                db.execute("UPDATE components SET enabled = FALSE WHERE view_id = " + std::to_string(view_id));

                // Process components
                if (viewData.contains("Components")) {
                    for (size_t j = 0; j < viewData["Components"].size(); ++j) {
                        const auto& compData = viewData["Components"][j];
                        int compNumber = j + 1;
                        std::string compName = compData["name"].is_null() ? "" : compData["name"].get<std::string>();
                        bool compEnabled = compData["enabled"].get<bool>();


                        // Insert or update component with ON CONFLICT
                        db.execute("INSERT INTO components (view_id, number, name, enabled) VALUES (" +
                            std::to_string(view_id) + ", " +
                            std::to_string(compNumber) + ", " +
                            db.escapeString(compName) + ", " +
                            (compEnabled ? "TRUE" : "FALSE") + ") " +
                            "ON CONFLICT (view_id, number) DO UPDATE SET " +
                            "name = EXCLUDED.name, enabled = EXCLUDED.enabled");
               }
           }
       }
   }

   db.execute("COMMIT");
} catch (...) {
   db.execute("ROLLBACK");
   throw;
}
}

void handleObjectsJson(Database& db, const std::string& jsonPath) {
std::ifstream objectsFile(jsonPath);
if (!objectsFile.is_open()) {
   throw std::runtime_error("Failed to open objects JSON file");
}

nlohmann::json objectsData = nlohmann::json::parse(objectsFile);

db.execute("BEGIN");
try {
   // Disable all existing objects instead of truncating
   db.execute("UPDATE objects SET enabled = FALSE");
   
   for (const auto& obj : objectsData) {
       std::string objName = obj["Object"].get<std::string>();
       std::string typeId = "NULL";
       
       if (!obj["Type"].is_null()) {
           int typeNum = obj["Type"].get<int>();
           auto typeRes = db.execQuery("SELECT id FROM object_types WHERE name = " + 
                                    db.escapeString("Type" + std::to_string(typeNum)));
           if (!typeRes.empty()) {
               typeId = std::to_string(typeRes[0]["id"].get<int>());
           }
       }

       // Insert or update object with ON CONFLICT
       db.execute("INSERT INTO objects (name, type_id, enabled) VALUES (" + 
                db.escapeString(objName) + ", " + typeId + ", TRUE) " +
                "ON CONFLICT (name, type_id) DO UPDATE SET " +
                "type_id = EXCLUDED.type_id, enabled = TRUE");
   }

   db.execute("COMMIT");
} catch (...) {
   db.execute("ROLLBACK");
   throw;
}
}

void handleJsonRequest(Database& db, const std::string& jsonType, const std::string& jsonPath) {
try {
   if (jsonType == "pages") {
       handlePagesJson(db, jsonPath);
       
       // Generate output files
       nlohmann::json currentObjects = db.getCurrentObjects();
       nlohmann::json currentViews = db.getViewsForObjects();

       std::ofstream("fromServerObject.json") << currentObjects.dump(2);
       std::ofstream("fromServerViews.json") << currentViews.dump(2);
   } 
   else if (jsonType == "objects") {
       handleObjectsJson(db, jsonPath);
   } 
   else {
       throw std::runtime_error("Unknown JSON type: " + jsonType);
   }
} catch (const std::exception& e) {
   throw std::runtime_error("Error processing " + jsonType + " JSON: " + e.what());
}
}

