package com.lang.Language.learn;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TextRepository extends JpaRepository<Text, Integer> {
    //get all records
    List<Text> findAll();
}