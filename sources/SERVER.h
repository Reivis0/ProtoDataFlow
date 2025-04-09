#ifndef SERVER_H
#define SERVER_H

#include"HANDLERS.h"


class Session : public std::enable_shared_from_this<Session>
{
public:
    explicit Session(tcp::socket&& socket) : stream_(std::move(socket)) {request_ = {}; buffer_.clear();};
    void run();
private:
    beast::tcp_stream stream_;
    beast::flat_buffer buffer_;
    http::request<http::string_body> request_;
    void process_request(http::response<http::string_body> res);
};

class Listener : public std::enable_shared_from_this<Listener>
{
public:
    Listener(net::io_context& ioc, const tcp::endpoint& endpoint);
    void run() { log("connection"); do_accept();};
private:
    net::io_context& ioc_;
    tcp::acceptor acceptor_;
   void do_accept();
   void fail(beast::error_code ec, const char* what) {std::cerr << what << ": " << ec.message() << "\n";
}
};

#endif