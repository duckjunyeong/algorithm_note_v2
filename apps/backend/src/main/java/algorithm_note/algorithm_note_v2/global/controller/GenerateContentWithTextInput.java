package algorithm_note.algorithm_note_v2.global.controller;

import com.google.genai.Chat;
import com.google.genai.Client;
import com.google.genai.ResponseStream;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
public class GenerateContentWithTextInput {
  public static void main(String[] args) {

    Client client = Client.builder().apiKey("API KEY").build(); // api key
    Chat chatSession = client.chats.create("gemini-2.5-flash");

    GenerateContentConfig config =
        GenerateContentConfig.builder()
            .systemInstruction(
                Content.fromParts(Part.fromText("Prompt"))) // prompt
            .build();


    ResponseStream<GenerateContentResponse> responseStream =
        client.models.generateContentStream(
            "gemini-2.5-flash", "user answer", config);

    for (GenerateContentResponse res : responseStream) {
      System.out.print(res.text());
    }

    responseStream.close();
  }
}