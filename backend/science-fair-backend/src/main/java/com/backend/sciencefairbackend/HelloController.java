package com.backend.sciencefairbackend;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/hello")
public class HelloController {
    
    @GetMapping("/")
    public ResponseEntity<List<String>> hello(){
        List<String> response = new ArrayList<>(Arrays.asList("Hello"));
        return new ResponseEntity<List<String>>(response, HttpStatus.OK);
    }
}
