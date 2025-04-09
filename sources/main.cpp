#include "SERVER.h"

int main()
{
    try
    {
        auto config = read_config("configServer.ini");
        
        auto const address = net::ip::make_address(config["server.address"]);
        unsigned short port = static_cast<unsigned short>(std::stoi(config["server.port"]));

        net::io_context ioc{1};

        std::make_shared<Listener>(ioc, tcp::endpoint{address, port})->run();

        ioc.run();
    }
    catch(const std::exception& ex)
    {
        std::cerr <<"Error: " <<ex.what() <<std::endl;;
    }
    
}