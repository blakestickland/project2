new Chart(document.getElementById("weekly-result"), {
  type: "bar",
  data: {
    labels: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    datasets: [
      {
        label: "Water Intake",
        backgroundColor: "#3e95cd",
        data: [7, 6, 5, 5, 6, 7, 5]
      },
      {
        label: "Calorie Intake",
        backgroundColor: "#8e5ea2",
        data: [4, 6, 8, 5, 6, 4, 6]
      },
      {
        label: "Excercise",
        backgroundColor: "#3cba9f",
        data: [6, 5, 4, 5, 6, 7, 9]
      },
      {
        label: "Sleep",
        backgroundColor: "#e8c3b9",
        data: [7, 6, 6, 7, 8, 8, 7]
      }
    ]
  },

  options: {
    title: {
      display: true,
      text: "Self Score (Rating 1-10)"
    }
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }
});
const weeklyResult = graphData => {
  fetch("/api/graph", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(weekly)
  })
    .then(() => {
      window.location.replace("/graph");
    })
    .catch(err => console.error(err));
  console.log(graphData);
};
weeklyResult();
