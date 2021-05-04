/** TEMPORARY TODO LIST TO DISPLAY AT BOTTOM OF PAGE */
export interface todo {
    item: string;
    description: string;
  }
  
  export const TODOS: todo[] = [
  { item: "Ask user for permission to access mic.", description: "" },
  { item: "Capture audio as input.", description: ""  },
  { item: "Process audio data into numerical frequency.", description: ""  },
  { item: "Convert frequency into a roman musical note along with octave.", description: ""  },
  { item: "Display musical note along with octave .", description: ""  },
  { item: "Set a default instrument (guitar) for target tuning frequencies (EADGBE).", description: ""  },
  { item: "Compare input audio with range of frequencies in current instrument.", description: ""  },
  { item: "Display a match if close.", description: ""  },
  { item: "Display distance away from closest heard frequency.", description: ""  },
  { item: "Add in different instrument tunings.", description: ""  },
  { item: "Use cookies to remember what the user picked.", description: ""  },
  { item: "Allow user to pick own tuning.", description: ""  },
  { item: "THERE WILL BE MORE.", description: ""  },
  ];