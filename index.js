// getting all the id's from the html
const contactList = document.getElementById("contactlist");
const contactName = document.getElementById("contactName");
const phoneNumber = document.getElementById("phoneNumber");
const addContact = document.getElementById("addContact");
const searchContact = document.getElementById("searchContact");

let contacts = [];

// Fetch contacts from API
const contactfetch = async () => {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await response.json();

        // Maping api data to js structure
        contacts = data.map((user, index) => ({
            id: index + 1,
            name: user.name,
            phone: user.phone
        }));

        contactDisplay(contacts);
    } catch (error) {
        alert("Data fetching failed!");
    }
};

// Displaying the contacts from the api 
const contactDisplay = (details) => {
    contactList.innerHTML = "";
    details.forEach((contact) => {
        const div = document.createElement("div");
        div.className =
            "rounded-2 d-flex align-items-center justify-content-between p-4 mt-2 mb-2 creatediv";
        div.innerHTML = `
      <span class="fs-6 fw-bold">${contact.name}</span>
      <span style="border: 1px solid black; width: 14px;"></span>
      <span class="fs-6 fw-bold">${contact.phone}</span>
      <div>
        <button style="font-weight: bold; width: 60px; height: 30px; background-color: rgb(131, 204, 246); color: black; border: 2px solid rgb(131, 204, 246);" onclick="editContact(${contact.id})">Edit</button>
        <button style="width: 80px; font-weight: bold; height: 30px; background-color: red; color: white; margin-left: 20px; border: 2px solid red;" onclick="deleteContact(${contact.id})">Delete</button>
      </div>
    `;
        contactList.appendChild(div);
    });
};

// Searching the contact from the array by name or phone number
searchContact.addEventListener("input", () => {
    const query = searchContact.value.toLowerCase().trim();

    if (query === "") {
        contactDisplay(contacts);
    } else {
        const filteredContacts = contacts.filter(contact =>
            contact.name.toLowerCase().includes(query) ||
            contact.phone.toLowerCase().includes(query)
        );

        contactDisplay(filteredContacts);
    }
});

// Adding the contact to the array and the list
addContact.addEventListener("click", () => {
    const inputName = contactName.value.trim();
    const inputPhone = phoneNumber.value.trim();

    if (!inputName || !inputPhone) {
        alert("Please fill name and number field");
        return;
    }

    const newContact = {
        id: contacts.length > 0 ? contacts[contacts.length - 1].id + 1 : 1,
        name: inputName,
        phone: inputPhone,
    };

    contacts.push(newContact);
    contactDisplay(contacts);
    contactName.value = "";
    phoneNumber.value = "";
});

// Editing the contact  
function editContact(id) {
    const contact = contacts.find((c) => c.id === id);
    const divs = Array.from(contactList.children);
    const div = divs.find((d) => d.innerHTML.includes(`editContact(${id})`));

    if (!div) return;

    // adding innerhtml div for edit option

    div.innerHTML = `
    <div class="edit-form w-100">
      <input type="text" id="editName-${id}" value="${contact.name}" class="form-control mb-2" placeholder="Edit name" />
      <input type="text" id="editPhone-${id}" value="${contact.phone}" class="form-control mb-2" placeholder="Edit phone" />
      <button class="save-btn" style="background-color: #28a745; color: white; border: none; padding: 6px 12px; border-radius: 6px;" onclick="saveContact(${id})">Save</button>
      <button class="cancel-btn" style="background-color: gray; color: white; border: none; padding: 6px 12px; border-radius: 6px; margin-left: 8px;" onclick="cancelEdit()">Cancel</button>
    </div>
  `;
}
function saveContact(id) {
    const nameInput = document.getElementById(`editName-${id}`);
    const phoneInput = document.getElementById(`editPhone-${id}`);

    const newName = nameInput.value.trim();
    const newPhone = phoneInput.value.trim();

    if (!newName || !newPhone) {
        alert("Both fields are required.");
        return;
    }

    const contact = contacts.find((e) => e.id === id);
    contact.name = newName;
    contact.phone = newPhone;

    contactDisplay(contacts);
}

function cancelEdit() {
    contactDisplay(contacts);
}

// Deleting the contact
function deleteContact(id) {
    contacts = contacts.filter((e) => e.id !== id);
    contactDisplay(contacts);
}
contactfetch();