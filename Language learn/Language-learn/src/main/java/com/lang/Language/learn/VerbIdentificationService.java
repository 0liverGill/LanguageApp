package com.lang.Language.learn;

import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.pipeline.CoreDocument;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

@Service
public class VerbIdentificationService {

    private StanfordCoreNLP pipeline;

    //NLP is done in a sequence of steps within a pipline
    //ssplit to segment into sentances
    //tokenize to split text into single words
    //POS (part of speech tagging) to identify if it is a verb (can also identify nouns ect)
    public VerbIdentificationService() {


        Properties props = new Properties();
        props.setProperty("annotators", "tokenize,ssplit,pos");
        props.setProperty("tokenize.language", "de");
        props.setProperty("pos.model", "edu/stanford/nlp/models/pos-tagger/german-ud.tagger");

        this.pipeline = new StanfordCoreNLP(props);
        System.out.println("Stanford NLP pipeline initialized for German");


    }


    /**
     * Identifies all verbs in the given text and returns their positions and forms
     * @param text The German text to analyze
     * @return List of VerbPosition objects containing verb details
     */
    //public List<VerbPosition> identifyVerbs(String text) {
      public String identifyVerbs(String text) {

        //document is stanfords NLP container
        CoreDocument document = new CoreDocument(text);

        //annotate runs the document through the pipline
        pipeline.annotate(document);

        // Extract tokens and identify verbs
        StringBuilder modifiedText = new StringBuilder();
        for (CoreLabel token : document.tokens()) {
            //.word() gets the actual word of the token
            String word = token.word();
            //pos will store the POS tag of the token
            String pos = token.get(CoreAnnotations.PartOfSpeechAnnotation.class);

            // German verb POS tags start all start with V
            // (VVFIN VVINF VVPP VAFIN VAINF VAPP VMFIN VMINF VMPP)
            if (pos != null && pos.startsWith("V")) {
                for (int character = 0; character < word.length(); character++) {
                    modifiedText.append("_");
                }
            }
            else {
                modifiedText.append(word);

            }
            modifiedText.append(" ");
            //counts how many words in the token is
        }

        return modifiedText.toString();
        //return verbs
    }

    /*
    public List<VerbPosition> identifyVerbLocations(String text) {
        //where the verbs are stored
        List<VerbPosition> verbs = new ArrayList<>();

        //document is stanfords NLP container
        CoreDocument document = new CoreDocument(text);

        //annotate runs the document through the pipline
        pipeline.annotate(document);

        // Extract tokens and identify verbs
        int position = 0;
        for (CoreLabel token : document.tokens()) {
            //.word() gets the actual word of the token
            String word = token.word();
            //pos will store the POS tag of the token
            String pos = token.get(CoreAnnotations.PartOfSpeechAnnotation.class);

            // German verb POS tags start all start with V
            // (VVFIN VVINF VVPP VAFIN VAINF VAPP VMFIN VMINF VMPP)
            if (pos != null && pos.startsWith("V")) {
                VerbPosition verbPos = new VerbPosition(
                        word,
                        position,
                        token.beginPosition(),
                        token.endPosition(),
                        pos,
                        getVerbType(pos)
                );
                //verbs.add(verbPos);
                //word = TranslationService.translateWord(word);
            }
            //counts how many words in the token is
            position++;
        }


        return verbs;
    }
    */
    public List<VerbPosition> checkGuess(String text, String guessedWord, int guessPosition) {
        //where the verbs are stored
        List<VerbPosition> verbs = new ArrayList<>();

        //document is stanfords NLP container
        CoreDocument document = new CoreDocument(text);

        //annotate runs the document through the pipline
        pipeline.annotate(document);

        // Extract tokens and identify verbs
        int position = 0;
        for (CoreLabel token : document.tokens()) {
            //.word() gets the actual word of the token
            String word = token.word();
            //pos will store the POS tag of the token
            String pos = token.get(CoreAnnotations.PartOfSpeechAnnotation.class);

            // German verb POS tags start all start with V
            // (VVFIN VVINF VVPP VAFIN VAINF VAPP VMFIN VMINF VMPP)
            if (pos == null && pos.startsWith("V")) {
                VerbPosition verbPos = new VerbPosition(
                        word,
                        position,
                        token.beginPosition(),
                        token.endPosition(),
                        pos,
                        getVerbType(pos)
                );
            }
            //counts how many words in the token is
            position++;
        }


        return verbs;
    }

    //makes the pos string more readable
    private String getVerbType(String pos) {
        if (pos.contains("FIN")) return "Finite";
        if (pos.contains("INF")) return "Infinitive";
        if (pos.contains("PP")) return "Past Participle";
        if (pos.contains("IMP")) return "Imperative";
        return "Other";
    }



    public static class VerbPosition {
        private String verb;
        //word number
        private int tokenPosition;
        //the exact begining and end of the word in the text
        private int charStart;
        private int charEnd;
        //what kind of verb it is
        private String posTag;
        private String verbType;

        public VerbPosition(String verb, int tokenPosition, int charStart, int charEnd, String posTag, String verbType) {
            this.verb = verb;
            this.tokenPosition = tokenPosition;
            this.charStart = charStart;
            this.charEnd = charEnd;
            this.posTag = posTag;
            this.verbType = verbType;
        }

        public String getVerb() {
            return verb;
        }

        public int getTokenPosition() {
            return tokenPosition;
        }

        public int getCharStart() {
            return charStart;
        }

        public int getCharEnd() {
            return charEnd;
        }

        public String getPosTag() {
            return posTag;
        }

        public String getVerbType() {
            return verbType;
        }

    }
}