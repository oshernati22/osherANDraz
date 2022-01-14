import React, { useEffect, useState } from "react";

const PatternsProcessor = ({ fileData }) => {
  const [hammers, setHammers] = useState();
  const [shooting, setShooting] = useState();
  const [resultShooting, setResultShooting] = useState();
  const [resultHammer, setResultHammer] = useState();

  useEffect(() => {
    console.log("here");
    if (fileData) {
      console.log("here 2");
      findHammers(fileData);
      findShooting(fileData);
    }
  }, [fileData]);

  useEffect(() => {
    if (hammers && shooting) {
      getResults(hammers, shooting, fileData);
    }
  }, [shooting, hammers]);

  const findHammers = (fileData) => {
    const hammersTemp = [];
    for (let i = 2; i < fileData.length - 1; i++) {
      if (
        fileData[i - 2]["Adj Close"] > fileData[i - 1]["Adj Close"] &&
        fileData[i - 1]["Adj Close"] > fileData[i]["Adj Close"] &&
        Math.abs(fileData[i].Open - fileData[i]["Adj Close"]) /
          (fileData[i].High - fileData[i].Low) <=
          0.35 &&
        (fileData[i].High -
          Math.max(fileData[i].Open, fileData[i]["Adj Close"])) /
          (fileData[i].High - fileData[i].Low) <=
          0.1
      ) {
        fileData[i].index = i;
        hammersTemp.push(fileData[i]);
      }
    }
    console.log(hammersTemp.length);
    setHammers(hammersTemp);
  };

  const findShooting = (fileData) => {
    const shootingTemp = [];
    for (let i = 2; i < fileData.length - 1; i++) {
      if (
        fileData[i - 2]["Adj Close"] < fileData[i - 1]["Adj Close"] &&
        fileData[i - 1].High < fileData[i].High &&
        Math.abs(fileData[i].Open - fileData[i]["Adj Close"]) /
          (fileData[i].High - fileData[i].Low) <=
          0.35 &&
        (Math.min(fileData[i].Open, fileData[i]["Adj Close"]) -
          fileData[i].Low) /
          (fileData[i].High - fileData[i].Low) <=
          0.1
      ) {
        fileData[i].index = i;
        shootingTemp.push(fileData[i]);
      }
    }
    console.log(shootingTemp.length, "shooting length");
    setShooting(shootingTemp);
  };

  const getResults = (hammers, shooting, fileData) => {
    let succeedHammers = 0;
    let succeedShooting = 0;
    let evenHammers = 0;
    let evenShooting = 0;
    for (let hammer of hammers) {
      if (
        fileData[hammer.index + 1].High * 0.99 >
          fileData[hammer.index + 1].Open &&
        fileData[hammer.index + 1].Low > hammer.Low
      ) {
        hammer.result = "Profit 🤑";
        succeedHammers++;
      } else if (
        fileData[hammer.index + 1].High * 0.99 >
          fileData[hammer.index + 1].Open &&
        fileData[hammer.index + 1].Low < hammer.Low
      ) {
        evenHammers++;
        hammer.result = "We dont know 🤷";
      } else {
        hammer.result = "No Profit 😪";
      }
    }
    for (let shot of shooting) {
      if (
        fileData[shot.index + 1].Low * 1.01 < fileData[shot.index + 1].Open &&
        fileData[shot.index + 1].High < shot.High
      ) {
        shot.result = "Profit 🤑";
        succeedShooting++;
      } else if (
        fileData[shot.index + 1].Low * 1.01 < fileData[shot.index + 1].Open &&
        fileData[shot.index + 1].High > shot.High
      ) {
        shot.result = "We dont know 🤷";
        evenShooting++;
      } else {
        shot.result = "No Profit 😪";
      }
    }
    setResultHammer(
      `succed hammers : ${succeedHammers} | even hammers : ${evenHammers} | lose hammers : ${
        hammers.length - (succeedHammers + evenHammers)
      }`
    );

    setResultShooting(
      `succed shooting : ${succeedShooting} | even shooting : ${evenShooting} | lose shooting : ${
        shooting.length - (succeedShooting + evenShooting)
      }`
    );
  };
  return (
    <div>
      {resultHammer ? <p>{resultHammer}</p> : " "}
      {resultShooting ? <p>{resultShooting}</p> : " "}
      {hammers ? <div> 🔨🔨🔨🔨🔨🔨🔨 Hammers 🔨🔨🔨🔨🔨🔨🔨</div> : ""}
      {hammers
        ? hammers.map((hammer) => {
            return (
              <p key={hammer.Date}>
                Date : {hammer.Date} --- Open : {hammer.Open} --- Low :{" "}
                {hammer.Low} --- Close : {hammer["Adj Close"]} --- Profit :{" "}
                {hammer.result}
              </p>
            );
          })
        : ""}
      {shooting ? <div>🌠🌠🌠🌠🌠🌠🌠 Shoting Stars 🌠🌠🌠🌠🌠🌠🌠</div> : " "}
      {shooting
        ? shooting.map((shot) => {
            return (
              <p key={shot.Date}>
                Date : {shot.Date} --- Open : {shot.Open} --- Low : {shot.Low}{" "}
                --- Close : {shot["Adj Close"]} --- Profit : {shot.result}
              </p>
            );
          })
        : ""}
    </div>
  );
};

export default PatternsProcessor;
