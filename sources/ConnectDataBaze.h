#ifndef CONNECTDATABAZE_H
#define CONNECTDATABAZE_H

#include <pqxx/pqxx>
#include <crypt.h>
#include <random>
#include <exception>
#include <iostream>
#include <vector>
#include <map>
#include <fstream>

const std::string HASHING_ERROR = "ERROR: password hashing failed\n";
const std::string VERIFICATION_ERROR = "ERROR: password verification failed\n";
const std::string CONNECTION_ERROR = "ERROR: error of connection\n";


void log(const std::string& msg);

std::map<std::string, std::string> read_config(const std::string& file);

struct User
{
    std::string login_;
    std::string password_;
    std::string status_;
    bool accsess_;
    bool agreement_;
    //startDate;
    //endTime;
};

std::string generate_salt_secure();
std::string hash_password(const std::string& password);
bool verify_password(const std::string& password, const std::string& stored_hash);

pqxx::connection connection_data_baze();

// база аутентификации
std::tuple<std::string, bool, bool, std::string> find_user(pqxx::connection& connect, const std::string& login, const std::string& password);
void processing_agreement();
//для АП
void add_login();
void add_password(const std::string& password);
void add_status();
void add_start_data();
void add_end_data();
void processing_access();//автоматическое?
void change_access();//ручное?

//база согласий
void add_info_into_agreement_baze(pqxx::connection& connect, const std::vector<std::tuple<std::string, std::string>>& data);
//для АП
void add_email();
void add_telephone();
void add_comments();

#endif