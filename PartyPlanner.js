document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event triggered.");

  const partyListElement = document.getElementById("partyList");
  const addPartyForm = document.getElementById("addPartyForm");

  function fetchPartyData() {
    fetch("https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-fsa-et-web-pt-sf-b-erin/events")
      .then(response => response.json())
      .then(data => {
        console.log("API Response:", data);
        if (data && data.success && Array.isArray(data.data)) {
          console.log("Data is an array:", data.data);
          renderPartyList(data.data);
        } else {
          console.log("Invalid data format or missing data:", data);
        }
      })
      .catch(error => {
        console.log("Error fetching party data:", error);
      });
  }

  function renderPartyList(parties) {
    partyListElement.innerHTML = ""; // Clear the party list

    const ul = document.createElement("ul");

    parties.forEach(party => {
      const li = createPartyListItem(party);
      ul.appendChild(li);
    });

    partyListElement.appendChild(ul);
  }

  function createPartyListItem(party) {
    const li = document.createElement("li");

    const name = document.createElement("h2");
    name.textContent = party.name;
    li.appendChild(name);

    const date = document.createElement("p");
    date.textContent = `Date: ${party.date}`;
    li.appendChild(date);

    const location = document.createElement("p");
    location.textContent = `Location: ${party.location}`;
    li.appendChild(location);

    const description = document.createElement("p");
    description.textContent = `Description: ${party.description}`;
    li.appendChild(description);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      deleteParty(party.id, li);
    });
    li.appendChild(deleteButton);

    return li;
  }

  function deleteParty(partyId, liElement) {
    fetch(`https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-fsa-et-web-pt-sf-b-erin/events/${partyId}`, {
      method: "DELETE"
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Delete request failed.");
        }
        liElement.remove(); // Remove the party's li element from the DOM immediately
      })
      .catch(error => {
        console.log("Error deleting party:", error);
      });
  }

  function addParty(party) {
    party.date = new Date(party.date).toISOString(); // Format the date as ISO-8601 DateTime

    fetch("https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-fsa-et-web-pt-sf-b-erin/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(party)
    })
      .then(response => response.json())
      .then(data => {
        console.log("Add Party Response:", data); // Log the add party response to the console

        if (data && data.success) {
          const li = createPartyListItem(data.data);
          partyListElement.firstElementChild.appendChild(li); // Add the new party's li element to the existing party list
          addPartyForm.reset(); // Reset the add party form
        } else {
          console.log("Add party failed:", data);
        }
      })
      .catch(error => {
        console.log("Error adding party:", error);
      });
  }

  fetchPartyData(); // Fetch and render the initial party list

  addPartyForm.addEventListener("submit", event => {
    event.preventDefault();

    const nameInput = addPartyForm.elements["name"];
    const dateInput = addPartyForm.elements["date"];
    const locationInput = addPartyForm.elements["location"];
    const descriptionInput = addPartyForm.elements["description"];

    const party = {
      name: nameInput.value,
      date: dateInput.value,
      location: locationInput.value,
      description: descriptionInput.value
    };

    addParty(party);
  });
});