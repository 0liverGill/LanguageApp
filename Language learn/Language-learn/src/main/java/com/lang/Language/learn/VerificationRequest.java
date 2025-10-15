package com.lang.Language.learn;


// request contains: guess, position, page, bookId
public class VerificationRequest {
        private String guess;
        private int page;
        private int bookId;
        private int position;

        public String getGuess() { return guess; }
        public void setName(String guess) { this.guess = this.guess; }

        public int getPage() { return page; }
        public void setPage(int page) { this.page = page; }


    public int getBookId() {
        return bookId;
    }

    public void setBookId(int bookId) {
        this.bookId = bookId;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }
}
