//http://thesaurus.altervista.org/thesaurus/v1?word=install&language=en_US&output=json&key=1D0RuTde04RC5aFNAQmq
import axios from 'axios';

axios
  .get('http://thesaurus.altervista.org/thesaurus/v1?word=install&language=en_US&output=json&key=1D0RuTde04RC5aFNAQmq')
  .then((response) => {
    const data: Synonim = response.data;
    console.log(data);
  });

export interface Synonim {
  response: Response[];
}

export interface Response {
  list: List;
}

export interface List {
  category: string;
  synonyms: string;
}
