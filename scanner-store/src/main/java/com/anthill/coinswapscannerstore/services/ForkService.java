package com.anthill.coinswapscannerstore.services;

import com.anthill.coinswapscannerstore.beans.Fork;
import com.microsoft.signalr.HubConnection;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ForkService {

    private final HubConnection hubConnection;
    private final ScheduledExecutorService executorService;
    private final RedisService redis;

    public ForkService(HubConnection hubConnection, ScheduledExecutorService executorService,
                       RedisService redis) {
        this.hubConnection = hubConnection;
        this.executorService = executorService;
        this.redis = redis;
    }

    public void save(Fork fork){
        redis.hSet(Fork.class.getSimpleName(), UUID.randomUUID().toString(), fork);
    }
    public void save(List<Fork> forks){
        Map<String, Object> forksMap = forks.stream()
                .collect(Collectors.toMap(
                        fork -> UUID.randomUUID().toString(), fork -> fork));

        redis.hSetAll(Fork.class.getSimpleName(), forksMap);
    }

    public Iterable<Fork> findAll(){
        return redis.hGetAll(Fork.class.getSimpleName())
                .values()
                .stream()
                .filter(o -> o instanceof Fork)
                .map(f -> (Fork) f)
                .collect(Collectors.toList());
    }

    public void deleteAll(){
        redis.flushAll();
    }

    public void init(){
        hubConnection.on("Send", (forks) -> {
            var forksList = Arrays.stream(forks).collect(Collectors.toList());

            forksList.forEach(fork ->
                    log.info("Fork: " + fork));

            save(forksList);
        }, Fork[].class);

        hubConnection.onClosed((ex) -> {
            ex.printStackTrace();
            executorService.scheduleWithFixedDelay(
                    hubConnection::start,0,5, TimeUnit.SECONDS);
        });

        hubConnection.start();
    }
}
