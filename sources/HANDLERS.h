#ifndef HANDLERS_H
#define HANDLERS_H

#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/beast/version.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <boost/asio/strand.hpp>
#include <nlohmann/json.hpp>
#include <cstdlib>
#include <iostream>
#include <memory>
#include <execution>
#include <chrono>
#include <iomanip>
#include <vector>
#include "ConnectDataBaze.h"

namespace beast = boost::beast;
namespace http = beast::http;
namespace net = boost::asio;
using tcp = net::ip::tcp;

const std::string INVALID_METHOD = "ERROR: invalid request method\n";




http::response<http::string_body> handle_request(const http::request<http::string_body>& req);
void do_authentication(const http::request<http::string_body>& req, http::response<http::string_body>& res);
void add_info_agreement(const http::request<http::string_body>& req, http::response<http::string_body>& res);


#endif