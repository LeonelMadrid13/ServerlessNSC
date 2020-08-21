let mealsState = [];
const stringToHTML = (s) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(s, "text/html");

  return doc.body.firstChild;
};

const renderItem = (item) => {
  const element = stringToHTML(`<li data-id="${item._id}"> ${item.name}</li>`);
  element.addEventListener("click", () => {
    const mealslist = document.getElementById("meals-list");
    Array.from(mealslist.children).forEach((x) =>
      x.classList.remove("selected")
    );
    element.classList.add("selected");
    const mealsIdInput = document.getElementById("meals-id");
    mealsIdInput.value = item._id;
  });

  return element;
};

const renderOrder = (order, meals) => {
  const meal = meals.find((meal) => meal._id === order.meal_id);
  const element = stringToHTML(
    `<li data-id="${order._id}"> ${meal.name} - ${order.user_id}</li>`
  );
  return element;
};

window.onload = () => {
  const orderForm = document.getElementById("order");
  orderForm.onsubmit = (e) => {
    e.preventDefault();
    const submit = document.getElementById("submit");
    submit.setAttribute("disabled", true);
    const mealId = document.getElementById("meals-id");
    const mealsIdValue = mealId.value;
    if (!mealsIdValue) {
      alert("debe seleccionar un plato");
      return;
    }

    const order = {
      meal_id: mealsIdValue,
      user_id: "chanchito triste",
    };

    fetch("https://serverless.masterkiri13.vercel.app/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((x) => x.json())
      .then((respuesta) => {
        const renderedOrder = renderOrder(respuesta, mealsState);
        const ordersList = document.getElementById("orders-list");
        ordersList.appendChild(renderedOrder);
        submit.removeAttribute("disabled");
      });
  };

  fetch("https://serverless.masterkiri13.vercel.app/api/meals")
    .then((response) => response.json())
    .then((data) => {
      mealsState = data;
      const mealslist = document.getElementById("meals-list");
      const submit = document.getElementById("submit");
      const listItems = data.map(renderItem);
      mealslist.removeChild(mealslist.firstElementChild);
      listItems.forEach((element) => mealslist.appendChild(element));
      submit.removeAttribute("disabled");
      fetch("https://serverless.masterkiri13.vercel.app/api/orders")
        .then((response) => response.json())
        .then((ordersData) => {
          const ordersList = document.getElementById("orders-list");
          const listOrders = ordersData.map((orderData) =>
            renderOrder(orderData, data)
          );
          ordersList.removeChild(ordersList.firstElementChild);
          listOrders.forEach((element) => ordersList.appendChild(element));
        });
    });
};
