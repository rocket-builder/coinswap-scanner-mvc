package com.anthill.coinswapscannermvc.services;

import com.anthill.coinswapscannermvc.beans.coinmarket.Fork;
import com.anthill.coinswapscannermvc.repos.ForkRepos;
import com.microsoft.signalr.HubConnection;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

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

    public void init(){
        hubConnection.on("Send", (forks) -> {

            Arrays.stream(forks).forEach(fork -> {
                System.out.println("Fork: " + fork.getUrl());
            });
        }, Fork[].class);

        hubConnection.onClosed((ex) -> {
            ex.printStackTrace();
            executorService.scheduleWithFixedDelay(
                    hubConnection::start,0,5, TimeUnit.SECONDS);
        });

        hubConnection.start();
    }
}
