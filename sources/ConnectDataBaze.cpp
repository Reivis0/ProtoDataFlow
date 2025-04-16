#include "ConnectDataBaze.h"

std::map<std::string, std::string> read_config(const std::string& filename)
{
    std::map<std::string, std::string> config;
    std::ifstream file(filename);
    std::string line, section;
    
    while (getline(file, line)) {
        if (line.empty() || line[0] == ';') continue;
        
        if (line[0] == '[' && line.back() == ']') {
            section = line.substr(1, line.size() - 2);
        } else {
            size_t pos = line.find('=');
            if (pos != std::string::npos) {
                std::string key = section + "." + line.substr(0, pos);
                std::string value = line.substr(pos + 1);
                config[key] = value;
            }
        }
    }
    
    return config;
}

void log(const std::string& msg)
{
    auto now = std::chrono::system_clock::now();
    auto now_time = std::chrono::system_clock::to_time_t(now);

    std::cout<<"["<<std::put_time(std::localtime(&now_time), "%Y-%m-%d %H:%M:%S")<<"]\t"<<msg<<std::endl;
}

std::string generate_salt_secure()
{   log("salt generation");
    const std::string resources = "./0-9A-Za-z";
    std::string salt = "$6";

    std::random_device random;
    std::mt19937 gen(random());
    std::uniform_int_distribution<> dist(0, resources.size()-1);

    for(int i = 0; i < resources.size(); ++i)
        salt+=resources[dist(gen)];
    return salt;
}

std::string hash_password(const std::string& password)
{   log("password hashing");
    std::string salt = generate_salt_secure();
    struct crypt_data data;
    data.initialized = 0;

    char* res = crypt_r(password.c_str(), salt.c_str(), &data);
    if(!res) throw std::runtime_error(HASHING_ERROR);

    return res;
}

bool verify_password(const std::string& password, const std::string& stored_hash)
{
    struct crypt_data data;
    data.initialized = 0;
    log("password verification");
    char* res = crypt_r(password.c_str(), stored_hash.c_str(), &data);
    if(!res) throw std::runtime_error(VERIFICATION_ERROR);

    return res == stored_hash;
}

pqxx::connection connection_data_baze()
{   
    log("connection the databaze");
    auto config = read_config("configBase.ini");
    std::string connection_str = 
                                "host=" + config["database.host"] + 
                                " port=" + config["database.port"] + 
                                " dbname=" + config["database.database_name"] + 
                                " user=" + config["database.username"] + 
                                " password=" + config["database.password"];
    
    pqxx::connection connect(connection_str);
        if(!connect.is_open()) throw std::runtime_error(CONNECTION_ERROR);
    log("successful connection");
        return connect;
}

std::tuple<std::string, bool, bool, std::string> find_user(pqxx::connection& connect, const std::string& login, const std::string& password)
{
    log("creating a transaction\n");
    pqxx::read_transaction read(connect);
    log("read from data baze\n");
    pqxx::result data = read.exec_params("SELECT Login_, Password_,Status_, Access, Agreement, StartDate, EndTime FROM user_info WHERE Login_ = $1 LIMIT 1", login);
    
    if(data.empty()) return {"User not found",false, false, "fail"};

    auto res = data.at(0);

    User user
    {
        res["Login_"].as<std::string>(),
        res["Password_"].as<std::string>(),
        res["Status_"].as<std::string>(),
        res["Access"].as<bool>(),
        res["Agreement"].as<bool>(),
        //startDate;
        //endTime;
    };
    read.commit();

    if (verify_password(password, user.password_)) return {"Incorrect password", false, false, user.status_};
    if (!user.accsess_) return {"Correct", false, false, user.status_};
    if (!user.agreement_) return {"Correct",false, true, user.status_};

    return {"Correct",true, true, user.status_};
}

void add_info_into_agreement_baze(pqxx::connection& connect, const std::vector<std::tuple<std::string, std::string>>& data)
{
    log("start add info into baze");
    pqxx::work trn(connect);
    
    std::string fields;
    std::string placeholders;
    std::vector<std::string> values;
    
    for (const auto& [field, value] : data) 
    {
        if (!fields.empty()) {
            fields += ", ";
            placeholders += ", ";
        }
        fields += field;
        placeholders += "$" + std::to_string(values.size() + 1);
        values.push_back(value);
    }
    
    std::string query = "INSERT INTO " + trn.quote_name("user_agreement") + 
                       " (" + fields + ") VALUES (" + placeholders + ")";
    
    log("query: " + query);
    
    connect.prepare("insert_info", query);
    
    pqxx::params params;
    for (const auto& value : values) {
        params.append(value);
    }
    
    trn.exec_prepared("insert_info", params);
    trn.commit();
    log("info was added");
}

bool add_login(pqxx::connection& connect, std::string& login)
{
    log("start add login into user base");
    pqxx::read_transaction read(connect);
    pqxx::result data = read.exec_params("SELECT Login_ FROM user_info WHERE Login_ = $1 LIMIT 1", login);
    if(!data.empty()) 
    {
        log("the login already exists");
        return false;
    }
    else
    {
        pqxx::work trn(connect);

        trn.exec_params("INSER INTO user_info LOGIN_ VALUES $1", login);
        trn.commit();
        log("login was added");
    }
    read.commit();
    return true;
}

bool add_password(pqxx::connection& connect,const std::string& password, const std::string& login)
{
    log("start add password into baze");
    pqxx::work trn(connect);

    auto res = trn.exec_params("UPDATE user_info SET Password_ = $1 WHERE Login_ = $2 RETURNING 1", hash_password(password), login);
    if(res.empty()) 
    {
        log("login not found");
        trn.abort();
        return false;
    }

    trn.commit();
    log("password was addede");
    return true;
}
 
bool processing_agreement(pqxx::connection& connect, const std::string& login)
{
    try
    {
        log("start update agreement");
        pqxx::work trn(connect);

        trn.exec_params("UPDATE user_info SET Agreement = $1 WHERE Login_ = $2", true, login);

        trn.commit();
        log("agreement has been successfully updated");
    }
    catch(std::exception& ex)
    {
        log("ERROR: error of update info");
        return false;
    }
    return true;
}

bool add_status(pqxx::connection& connect, const std::string& status, const std::string& login)
{
    log("start add status");
    pqxx::work trn(connect);

    auto res = trn.exec_params("UPDATE user_info SET Status_ = $1 WHERE Login_ = $2 RETURNING 1", status, login);
    if(res.empty()) 
    {
        log("login not found");
        trn.abort();
        return false;
    }

    trn.commit();
    log("status was added");
    return true;
}

bool add_start_data(pqxx::connection& connect, const std::string& startDate, const std::string& login)
{
    log("start add start date");
    pqxx::work trn(connect);
    
    auto res = trn.exec_params("UPDATE user_info SET StartDate = $1 WHERE Login_ = $2 RETURNING 1", startDate, login);
    if(res.empty()) 
    {
        log("login not found");
        trn.abort();
        return false;
    }

    trn.commit();
    log("start date was added");
    return true;
}

bool add_end_data(pqxx::connection& connect, const std::string& endDate, const std::string& login)
{
    log("start add end date");
    pqxx::work trn(connect);
    
    auto res = trn.exec_params("UPDATE user_info SET EndTime = $1 WHERE Login_ = $2 RETURNING 1", endDate, login);
    if(res.empty()) 
    {
        log("login not found");
        trn.abort();
        return false;
    }

    trn.commit();
    log("end date was added");
    return true;
}

bool change_access(pqxx::connection& connect, const bool access, const std::string& login)
{
    log("start update access");
    pqxx::work trn(connect);
    
    auto res = trn.exec_params("UPDATE user_info SET Access = $1 WHERE Login_ = $2 RETURNING 1", access, login);
    if(res.empty()) 
    {
        log("login not found");
        trn.abort();
        return false;
    }

    trn.commit();
    log("access was updated");
    return true;
}

bool add_email(pqxx::connection& connect,const std::string& email, const std::string& login)
{
    log("start add email");
    pqxx::work trn(connect);
    
    auto res = trn.exec_params("UPDATE user_agreement SET Email_ = $1 WHERE Login_ = $2 RETURNING 1", email, login);
    if(res.empty()) 
    {
        log("login not found");
        trn.abort();
        return false;
    }

    trn.commit();
    log("email was added");
    return true;
}

bool add_telephone(pqxx::connection& connect,const std::string& telephone, const std::string& login)
{
    log("start add telephone");
    pqxx::work trn(connect);
    
    auto res = trn.exec_params("UPDATE user_agreement SET Telephone_ = $1 WHERE Login_ = $2 RETURNING 1", telephone, login);
    if(res.empty()) 
    {
        log("login not found");
        trn.abort();
        return false;
    }

    trn.commit();
    log("telephone was added");
    return true;
}

bool add_comments(pqxx::connection& connect,const std::string& comments, const std::string& login)
{
    log("start add comments");
    pqxx::work trn(connect);
    
    auto res = trn.exec_params("UPDATE user_agreement SET Comments_ = $1 WHERE Login_ = $2 RETURNING 1", comments, login);
    if(res.empty()) 
    {
        log("login not found");
        trn.abort();
        return false;
    }

    trn.commit();
    log("comments was added");
    return true;
}