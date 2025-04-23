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
struct User_info
{
    std::string login;
    std::string password;
    std::string surname;
    std::string name;
    std::string patronymic;
    bool access;
    std::string start_date;
    std::string end_date;
    std::string email;
    std::string telephone;
    std::string comments; 
};

std::string generate_salt_secure();
std::string hash_password(const std::string& password);
bool verify_password(const std::string& password, const std::string& stored_hash);

pqxx::connection connection_data_baze();

// база аутентификации
std::tuple<std::string, bool, bool, std::string> find_user(pqxx::connection& connect, const std::string& login, const std::string& password);
bool processing_agreement(pqxx::connection& connect, const std::string& login);
//для АП
bool add_login(pqxx::connection& connect, const std::string& login);
bool add_password(pqxx::connection& connect, const std::string& password, const std::string& login);
bool add_status(pqxx::connection& connect, const std::string& status, const std::string& login);
bool add_start_data(pqxx::connection& connect, const std::string& startDate, const std::string& login);
bool add_end_data(pqxx::connection& connect, const std::string& endDate, const std::string& login);
//void processing_access(); автоматическое (позже)
bool change_access(pqxx::connection& connect, const bool access, const std::string& login);//ручное

//база согласий
void add_info_into_agreement_baze(pqxx::connection& connect, const std::vector<std::tuple<std::string, std::string>>& data);
//для АП
bool add_email(pqxx::connection& connect, const std::string& email, const std::string& login);
bool add_telephone(pqxx::connection& connect, const std::string& telephone, const std::string& login);
bool add_comments(pqxx::connection& connect, const std::string& comments, const std::string& login);

//вывод информации для АП
void  get_info_from_user_info(pqxx::connection& conn,std::string user_status,std::vector<User_info>& info);
void get_info_from_user_agreement(pqxx::connection& conn, std::vector<User_info>& info);

#endif