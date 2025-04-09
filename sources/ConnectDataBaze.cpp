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

    if (password != user.password_) return {"Incorrect password", false, false, user.status_};
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

void add_password(const std::string& password)
{
    std::string h_password = hash_password(password);
    //добавление в базу
}
