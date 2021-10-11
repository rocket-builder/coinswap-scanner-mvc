package com.anthill.coinswapscannerstore.services;

import com.anthill.coinswapscannerstore.beans.Fork;
import com.anthill.coinswapscannerstore.repos.ForkRepos;
import com.microsoft.signalr.HubConnection;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ForkService {

    private final HubConnection hubConnection;
    private final ForkRepos forkRepos;
    private final ScheduledExecutorService executorService;

    public ForkService(HubConnection hubConnection, ForkRepos forkRepos,
                       ScheduledExecutorService executorService) {
        this.hubConnection = hubConnection;
        this.forkRepos = forkRepos;
        this.executorService = executorService;
    }

    public Iterable<Fork> findAll(){
        return forkRepos.findAll();
    }

    public void deleteAll(){
        forkRepos.deleteAll();
    }

    public void init(){
        hubConnection.on("Send", (forks) -> {

            Arrays.stream(forks).forEach(fork -> {
                log.info(fork.getId() + "-> Fork: " + fork);
            });
            forkRepos.saveAll(
                    Arrays.stream(forks).collect(Collectors.toList()));
        }, Fork[].class);

        hubConnection.onClosed((ex) -> {
            ex.printStackTrace();
            executorService.scheduleWithFixedDelay(
                    hubConnection::start,0,5, TimeUnit.SECONDS);
        });

        hubConnection.start();
    }
}
