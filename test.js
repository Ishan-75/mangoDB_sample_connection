import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

dns.promises.resolveSrv(
    '_mongodb._tcp.sample.dne1ayh.mongodb.net'
)
.then(records => {
    console.log("DNS SUCCESS:", records);
})
.catch(error => {
    console.error("DNS FAILED:", error);
});