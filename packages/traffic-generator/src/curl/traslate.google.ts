import axios from "axios";
// https://translate.google.co.id/translate?hl=id&sl=en&tl=id&u=http://webmanajemen.com
// https://translate.googleusercontent.com/translate_c?depth=3&nv=1&ie=UTF8&rurl=translate.google.com&sl=en&hl=en&tl=id&u=
(async () => {
  try {
    const { data, config } = await axios.get(
      "https://translate.google.co.id/translate?hl=id&sl=en&tl=id&u=http://webmanajemen.com"
    );
    console.log(config);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("axios error", error);
    } else {
      console.log("unexpected error", error);
    }
  }
})();
