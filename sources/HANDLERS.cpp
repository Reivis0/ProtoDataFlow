#include "HANDLERS.h"

pqxx::connection conn = connection_data_baze();

http::response<http::string_body> handle_request(const http::request<http::string_body>& req) 
{
    log("handler request");
    http::response<http::string_body> res;
    std::cout<<req<<std::endl;

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

    add_info_into_agreement_baze(conn, data);
    nlohmann::json result_json = {{"process", "true"}};
    res.body() = result_json.dump();
    log("response agreement prepared");
}