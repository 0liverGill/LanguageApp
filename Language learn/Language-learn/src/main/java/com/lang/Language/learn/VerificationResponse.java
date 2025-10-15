package com.lang.Language.learn;

public class VerificationResponse {

    private Boolean correct;
    private String correctWord;
    private String translation;

    public VerificationResponse(boolean correct, String correctWord, String translation) {
        this.correct = correct;
        this.correctWord = correctWord;
        this.translation = translation;
    }

    public Boolean getCorrect() {
        return correct;
    }

    public void setCorrect(Boolean correct) {
        this.correct = correct;
    }

    public String getCorrectWord() {
        return correctWord;
    }

    public void setCorrectWord(String correctWord) {
        this.correctWord = correctWord;
    }

    public String getTranslation() {
        return translation;
    }

    public void setTranslation(String translation) {
        this.translation = translation;
    }
}
