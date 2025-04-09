#include "SERVER.h"

void Session::run() 
{
    log("session run");
    auto self(shared_from_this());
    http::async_read(stream_, buffer_, request_,
        [this, self](beast::error_code ec, size_t) 
    {
        if (!ec) 
        {
            log("massage is recieved");
            process_request(handle_request(request_)); 
        }
        else log("ERROR: error of geting");
    });
}

void Session::process_request(http::response<http::string_body> res)
{
    log("request process");
    try
    {
        res.set(http::field::content_type, "application/json");
        res.set(http::field::access_control_allow_origin, "*");
        res.keep_alive(false);

        auto self(shared_from_this());
        auto sp = std::make_shared<http::response<http::string_body>>(std::move(res));
        
        http::async_write(stream_, *sp,
            [this, self, sp](beast::error_code ec, size_t bytes)
            {
                if(ec) {
                    log("ERROR: async_write failed: " + ec.message());
                    return;
                }
                
                log("sent " + std::to_string(bytes) + " bytes");
                
                beast::error_code shutdown_ec;
                stream_.socket().shutdown(tcp::socket::shutdown_send, shutdown_ec);
                if(shutdown_ec) {
                    log("WARN: shutdown error: " + shutdown_ec.message());
                }
                log("session closed");
            });
    }
    catch(std::exception &ex) {
        std::cerr << "process_request exception: " << ex.what() << std::endl;
    }
}

Listener::Listener(net::io_context& ioc, const tcp::endpoint& endpoint)
    :ioc_(ioc), acceptor_(ioc)
{
    beast::error_code ec;
        
    acceptor_.open(endpoint.protocol(), ec);
    if (ec) {
        fail(ec, "open");
        return;
    }
    
    acceptor_.set_option(net::socket_base::reuse_address(true), ec);
    if (ec) {
        fail(ec, "set_option");
        return;
    }
    
    acceptor_.bind(endpoint, ec);
    if (ec) {
        fail(ec, "bind");
        return;
    }
    
    acceptor_.listen(net::socket_base::max_listen_connections, ec);
    if (ec) {
        fail(ec, "listen");
        return;
    }
}

void Listener::do_accept()
{
    acceptor_.async_accept(
        net::make_strand(ioc_),
        [self = shared_from_this()](beast::error_code ec, tcp::socket socket) 
        {
            if (!ec) 
            {
                log("new session accept");
                std::make_shared<Session>(std::move(socket))->run();
            }
            else
                log("Error: accept error");

            self->do_accept();
        });
}
