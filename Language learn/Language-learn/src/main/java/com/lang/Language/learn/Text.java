package com.lang.Language.learn;

import jakarta.persistence.*;

@Entity
@Table(name = "texts")
public class Text {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(name = "file_path")
    private String filePath;

    // Getters and setters

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
}
