document.addEventListener("DOMContentLoaded", async () => {
  const partyListElement = document.getElementById("partyList");
  const addPartyForm = document.getElementById("addPartyForm");

  const state = {
    parties: []
  };

  async function fetchPartyData() {
    try {
      const response = await fetch("https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-fsa-et-web-pt-sf-b-erin/events");
      const data = await response.json();

      if (data && data.success && Array.isArray(data.data)) {
        state.parties = data.data;
        renderPartyList(state.parties);
      } else {
        console.log("Invalid data format or missing data:", data);
      }
    } catch (error) {
      console.log("Error fetching party data:", error);
    }
  }

  function renderPartyList(parties) {
    partyListElement.innerHTML = "";

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

  async function deleteParty(partyId, liElement) {
    try {
      const response = await fetch(`https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-fsa-et-web-pt-sf-b-erin/events/${partyId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Delete request failed.");
      }

      state.parties = state.parties.filter(party => party.id !== partyId);
      renderPartyList(state.parties);
    } catch (error) {
      console.log("Error deleting party:", error);
    }
  }

  async function addParty(party) {
    party.date = new Date(party.date).toISOString();

    try {
      const response = await fetch("https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-fsa-et-web-pt-sf-b-erin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(party)
      });

      const data = await response.json();

      if (data && data.success) {
        state.parties.push(data.data);
        renderPartyList(state.parties);
        addPartyForm.reset();
      } else {
        console.log("Add party failed:", data);
      }
    } catch (error) {
      console.log("Error adding party:", error);
    }
  }

  await fetchPartyData();

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