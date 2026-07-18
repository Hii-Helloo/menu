let menuData = [];

const dateFilter = document.getElementById("dateFilter");
const restaurantFilter = document.getElementById("restaurantFilter");
const timeFilter = document.getElementById("timeFilter");
const menuList = document.getElementById("menuList");

fetch("menu.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("menu.json을 불러오지 못했습니다.");
    }

    return response.json();
  })
  .then((data) => {
    menuData = data;

    fillFilters();
    renderMenu();
  })
  .catch((error) => {
    menuList.innerHTML = `
      <div class="empty-message">
        ${error.message}
      </div>
    `;

    console.error(error);
  });

function fillFilters() {
  const dates = [...new Set(menuData.map((item) => formatDate(item["날짜"])))];
  const restaurants = [...new Set(menuData.map((item) => item["식당"]))];
  const times = [...new Set(menuData.map((item) => item["시간"]))];

  fillSelect(dateFilter, dates);
  fillSelect(restaurantFilter, restaurants);
  fillSelect(timeFilter, times);

    const today = getTodayText();

  if (dates.includes(today)) {
    dateFilter.value = today;
  } else {
    dateFilter.selectedIndex=0;
  }
}

function fillSelect(selectElement, values) {
  selectElement.innerHTML = "";

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;

    if (selectElement === dateFilter) {
      option.textContent = formatDateWithDay(value);
    } else {
      option.textContent = value;
    }

    selectElement.appendChild(option);
  });
}

function renderMenu() {
  const selectedDate = dateFilter.value;
  const selectedRestaurant = restaurantFilter.value;
  const selectedTime = timeFilter.value;

  const filteredData = menuData.filter((item) => {
    return (
      formatDate(item["날짜"]) === selectedDate &&
      item["식당"] === selectedRestaurant &&
      item["시간"] === selectedTime
    );
  });

  const groupedByCourse = {};

  filteredData.forEach((item) => {
    const course = item["코스"];

    if (!groupedByCourse[course]) {
      groupedByCourse[course] = [];
    }

    groupedByCourse[course].push(item["메뉴"]);
  });

  menuList.innerHTML = "";

  const courses = Object.keys(groupedByCourse);

  if (courses.length === 0) {
    menuList.innerHTML = `
      <div class="empty-message">
        해당 조건의 식단이 없습니다.
      </div>
    `;
    return;
  }

  courses.forEach((course) => {
    const card = document.createElement("article");
    card.className = "course-card";

    const menuItems = groupedByCourse[course]
      .map((menu) => `<li>${menu}</li>`)
      .join("");

    card.innerHTML = `
      <h2>${course} 코스</h2>
      <ul>${menuItems}</ul>
    `;

    menuList.appendChild(card);
  });
}

function formatDate(dateText) {
  return dateText.slice(0, 10);
}
function getTodayText() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateWithDay(dateText) {
  const date = new Date(`${dateText}T00:00:00`);

  const weekdays = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일"
  ];

  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${weekdays[date.getDay()]}`;
}
dateFilter.addEventListener("change", renderMenu);
restaurantFilter.addEventListener("change", renderMenu);
timeFilter.addEventListener("change", renderMenu);