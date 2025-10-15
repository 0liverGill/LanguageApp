package com.lang.Language.learn;

//package com.yourpackage.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Allow React app to connect
public class TranslationController {

    @Autowired
    private TranslationService translationService;

    @PostMapping("/translate")
    public Map<String, String> translateWord(@RequestBody Map<String, String> request) {
        String word = request.get("word");
        String source = request.get("source");
        String target = request.get("target");

        String translation = translationService.translateWord(word);

        Map<String, String> response = new HashMap<>();
        response.put("word", word);
        response.put("translation", translation);
        return response;
    }
}