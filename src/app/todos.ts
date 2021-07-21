/** TEMPORARY TODO LIST TO DISPLAY AT BOTTOM OF PAGE */
export interface todo {
    item: string;
    description: string;
  }
  
  export const TODOS: todo[] = [
  { item: "Implement system to determine input note's closest target note", description: "" },
  { item: "FINISHED - Ask user for permission to access mic.", description: "" },
  { item: "FINISHED - Capture audio as input.", description: ""  },
  { item: "IN PROGRESS - Process audio data into numerical frequency.", description: ""  },
  { item: "FINISHED - Convert frequency into a musical note along with octave.", description: ""  },
  { item: "FINISHED - Display musical note along with octave .", description: ""  },
  { item: "IN PROGRESS - Set a default instrument (guitar) for target tuning frequencies (EADGBE).", description: ""  },
  { item: "IN PROGRESS - Compare input audio with range of frequencies in current instrument.", description: ""  },
  { item: "Display a match if close.", description: ""  },
  { item: "Display distance away from closest heard frequency.", description: ""  },
  { item: "Add in different instrument tunings.", description: ""  },
  { item: "Use cookies to remember what the user picked.", description: ""  },
  { item: "Allow user to pick own tuning.", description: ""  },
  { item: "THERE WILL BE MORE.", description: ""  },
  ];