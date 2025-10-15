package com.lang.Language.learn;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final TextRepository textRepository;

    public BookController(TextRepository messageRepository) {
        this.textRepository = messageRepository;
    }
    VerbIdentificationService identifyVerb = new VerbIdentificationService();
    @GetMapping("/{bookId}/text/{pageNumber}/{testBool}")
    public String getTextPage(
            @PathVariable int bookId,
            @PathVariable int pageNumber,
            @PathVariable boolean testBool
    ) throws IOException {
        String filePath = getFilePathFromDatabase(bookId);

        int wordsPerPage = 200;

        String content = Files.readString(Path.of(filePath));
        String[] words = content.split("\\s+");

        if (pageNumber < 0){
            pageNumber = 0;
        }
        int start = pageNumber * wordsPerPage;
        int end = Math.min(start + wordsPerPage, words.length);

        if (start >= words.length) {
            return "End of book.";
        }

        String textString = String.join(" ", Arrays.copyOfRange(words, start, end));
        if (testBool) {
            return identifyVerb.identifyVerbs(textString);
        }
        else
        {
            return  textString;
        }

    }
    @GetMapping("/{bookId}/bookTitle")
    public String getTextPage(@PathVariable int bookId) throws IOException {
        Optional<Text> optionalBook = textRepository.findById(bookId);
        //Text check = textRepository.findById(1).orElseThrow(() -> new RuntimeException("User not found"));
        if (optionalBook.isPresent()) {
            Text theBook = optionalBook.get();
            return theBook.getTitle();
        }
        else {
            return ("Book not found");
        }

    }
    @GetMapping("/allBooks")
    public List<Text> getAllBooks() throws IOException {
        //return "SHOOOO";
        return textRepository.findAll();

        /*
        //List<String> = newArrayListoutBooks;
        //need to return multiple data types
        for (int i=0; i<Books.size(); i++ )
        {
            outBooks.add();
        }
        return Books;
        */



    }

    @PostMapping("/verb")
    public ResponseEntity<VerificationResponse> verifyVerb(@RequestBody VerificationRequest request) throws IOException {
        // request contains: guess, position, page, bookId

        String filePath = getFilePathFromDatabase(request.getBookId());

        int wordsPerPage = 200;

        String content = Files.readString(Path.of(filePath));
        String[] words = content.split("\\s+");

        int start = request.getPage() * wordsPerPage;
        int end = Math.min(start + wordsPerPage, words.length);

        if (start >= words.length) {
            return ResponseEntity.ok(new VerificationResponse(
                    false,        // boolean
                    "end",    // String (German)
                    "end"     // String (English)
            ));
        }

        //String textString = String.join(" ", Arrays.copyOfRange(words, start, end));
        //List<VerbIdentificationService.VerbPosition> verbs= identifyVerb.checkGuess(textString,request.getGuess(),request.getPosition());
        boolean correct;

        String theGuess = request.getGuess();
        int thePosition = request.getPosition();
        String correctWord = words[start + request.getPosition()];
        String translation = "shlooby";
        correct = correctWord.equals(request.getGuess());
        //String[] tokens = inputText.split("(?<=\\s+|[.,!?;:])|(?=\\s+|[.,!?;:])");


        return ResponseEntity.ok(new VerificationResponse(
                correct,
                correctWord,
                translation
        ));


    }



    private String getFilePathFromDatabase(int bookId) {
        return textRepository.findById(bookId)
                .map(Text::getFilePath)
                .orElseThrow(() -> new RuntimeException("Book not found: " + bookId));
    }
}
