package com.anthill.coinswapscannermvc;

import com.anthill.coinswapscannermvc.services.StoreService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.net.URISyntaxException;

@SpringBootTest
class CoinswapScannerMvcApplicationTests {

	@Autowired
	StoreService storeService;

	@Test
	void contextLoads() {
	}

	@Test
	void storeServiceTest() throws InterruptedException, IOException, URISyntaxException {
		var forks = storeService.findAll();

		assert forks != null;
	}
}
