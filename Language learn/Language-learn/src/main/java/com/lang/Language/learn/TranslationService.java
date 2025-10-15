package com.lang.Language.learn;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Service
public class TranslationService {
    //static cause it doesnt affect the object state
    public static String translateWord(String word) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:5000/translate";

        String jsonBody = String.format(
                "{\"q\":\"%s\",\"source\":\"de\",\"target\":\"en\",\"format\":\"text\"}",
                word
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

        String response = restTemplate.postForObject(url, entity, String.class);
        String translation = response.substring(
                response.indexOf("\":\"") + 3,
                response.lastIndexOf("\"")
        );

        return translation;
    }
}