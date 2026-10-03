window.TimeExchangeExample = {
      activities: {
        "A": { name:"A — Site prep", duration:2, crashOptions:[{duration:2,cost:0},{duration:1,cost:60}] },
        "B": { name:"B — Foundations", duration:5, crashOptions:[{duration:5,cost:0},{duration:4,cost:70},{duration:3,cost:160}] },
        "C": { name:"C — Framing", duration:3, crashOptions:[{duration:3,cost:0},{duration:2,cost:40},{duration:1,cost:110}] },
        "D": { name:"D — MEP rough-in", duration:6, crashOptions:[{duration:6,cost:0},{duration:4,cost:200},{duration:3,cost:320}] },
        "E": { name:"E — Enclosure", duration:11, crashOptions:[{duration:11,cost:0},{duration:9,cost:150},{duration:8,cost:230},{duration:7,cost:330}] },
        "F": { name:"F — Interiors", duration:5, crashOptions:[{duration:5,cost:0},{duration:4,cost:80},{duration:3,cost:140}] },
        "G": { name:"G — Commissioning", duration:1, crashOptions:[{duration:1,cost:0}] }
      },
      precedences: [
        {from:"A",to:"B"},{from:"A",to:"C"},{from:"B",to:"D"},{from:"C",to:"D"},
        {from:"D",to:"E"},{from:"C",to:"F"},{from:"E",to:"G"},{from:"F",to:"G"}
      ]
    };
