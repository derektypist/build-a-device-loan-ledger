const equipmentLedger = {
  "1": { type: "PC", status: "CheckedOut", borrower: { name: "John Smith", email: "john@acme.org" }, dueDate: "11/30/2025" },
  "2": { type: "Laptop", status: "CheckedIn", borrower: { name: "", email: "" }, dueDate: "" },
  "3": { type: "Laptop", status: "CheckedOut", borrower: { name: "Jane Doe", email: "jane@acme.org" }, dueDate: "10/31/2025" },
  "4": { type: "iPad", status: "CheckedIn", borrower: { name: "", email: "" }, dueDate: "" }
};

function serializeLedger(ledger) {
  return JSON.stringify(ledger);
}

function loadLedger(json) {
  return JSON.parse(json);
}

function checkoutDevice(ledger, assetTag, borrower) {
  const updatedLedger = loadLedger(serializeLedger(ledger));

  if (!updatedLedger[assetTag]) {
    return {
      ledger: updatedLedger,
      message: `Asset tag ${assetTag} was not found in the ledger.`
    };
  }

  if (updatedLedger[assetTag].status === "CheckedOut") {
    return {
      ledger: updatedLedger,
      message: `${updatedLedger[assetTag].type} with asset tag ${assetTag} is already checked out.`
    };
  }

  updatedLedger[assetTag].status = "CheckedOut";
  updatedLedger[assetTag].borrower.name = borrower.name;
  updatedLedger[assetTag].borrower.email = borrower.email;
  updatedLedger[assetTag].dueDate = "";
  const message = `${updatedLedger[assetTag].type} with asset tag ${assetTag} has been checked out to ${updatedLedger[assetTag].borrower.name}.`;
  return {
    ledger: updatedLedger,
    message: message
  };
}

function checkinDevice(ledger, assetTag) {
  const updatedLedger = loadLedger(serializeLedger(ledger));
  
  if (!updatedLedger[assetTag]) {
    return {
      ledger: updatedLedger,
      message: `Asset tag ${assetTag} was not found in the ledger.`
    };
  }

  updatedLedger[assetTag].status = "CheckedIn";
  updatedLedger[assetTag].borrower.name = "";
  updatedLedger[assetTag].borrower.email = "";
  updatedLedger[assetTag].dueDate = "";
  const message = `${updatedLedger[assetTag].type} with asset tag ${assetTag} has been checked in.`;
  return {
    ledger: updatedLedger,
    message: message
  }
}

function reformatDate(date) {
  const datePartsArray = date.split("/");
  let month = datePartsArray[0];
  let day = datePartsArray[1];
  const year = datePartsArray[2];
  month = month.padStart(2,"0");
  day = day.padStart(2,"0");
  const formattedDate = year + month + day;
  return parseInt(formattedDate, 10);
}

function listOverdueDevices(ledger, today) {
  const todayFormatted = reformatDate(today);
  const overdue = [];
  for (const assetTag in ledger) {
    const item = ledger[assetTag];
    if (item.status === "CheckedOut" && item.dueDate) {
      if (reformatDate(item.dueDate) < todayFormatted) overdue.push(item);
    }
  }
  return overdue.sort((a,b) => reformatDate(a.dueDate) - reformatDate(b.dueDate));
}

console.log(listOverdueDevices(equipmentLedger,"9/5/2026"));
