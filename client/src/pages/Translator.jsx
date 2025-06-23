import React, { useState } from "react";
import axios from "axios";

const Translator = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [language, setLanguage] = useState("ml"); // Default: Malayalam

  const translateText = async () => {
    try {
      const response = await axios.get(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=en|${language}`
      );

      setTranslatedText(response.data.responseData.translatedText);
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  return (
    <div>
      <h2>Free Text Translator</h2>
      <textarea
        placeholder="Enter text to translate"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <select onChange={(e) => setLanguage(e.target.value)}>
        <option value="ml">Malayalam</option>
        <option value="ta">Tamil</option>
        <option value="kn">Kannada</option>
        <option value="hi">Hindi</option>
      </select>
      <button onClick={translateText}>Translate</button>
      <h3>Translated Text:</h3>
      <p>{translatedText}</p>
    </div>
  );
};

export default Translator;
