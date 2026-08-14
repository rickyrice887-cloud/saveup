// ==========================================
// SAVEUP
// FULL SCRIPT
// ==========================================


// ==========================================
// DATA
// ==========================================

let goals =
  JSON.parse(
    localStorage.getItem("saveup_goals")
  ) || [];

let totalSaved =
  Number(
    localStorage.getItem("saveup_total")
  ) || 0;

let history =
  JSON.parse(
    localStorage.getItem("saveup_history")
  ) || [];


let moneyMode = "add";


// ==========================================
// ELEMENTS
// ==========================================

const totalSavedElement =
  document.getElementById("totalSaved");

const goalsContainer =
  document.getElementById("goals");

const goalModal =
  document.getElementById("goalModal");

const moneyModal =
  document.getElementById("moneyModal");

const goalNameInput =
  document.getElementById("goalName");

const goalAmountInput =
  document.getElementById("goalAmount");

const moneyAmountInput =
  document.getElementById("moneyAmount");

const moneyTitle =
  document.getElementById("moneyTitle");

const confirmMoneyBtn =
  document.getElementById("confirmMoneyBtn");

const homeScreen =
  document.getElementById("homeScreen");

const goalsScreen =
  document.getElementById("goalsScreen");

const addScreen =
  document.getElementById("addScreen");

const settingsScreen =
  document.getElementById("settingsScreen");


// ==========================================
// SAVE DATA
// ==========================================

function saveData() {

  localStorage.setItem(
    "saveup_goals",
    JSON.stringify(goals)
  );

  localStorage.setItem(
    "saveup_total",
    totalSaved.toString()
  );

  localStorage.setItem(
    "saveup_history",
    JSON.stringify(history)
  );

}


// ==========================================
// MONEY FORMAT
// ==========================================

function formatMoney(amount) {

  return "$" +
    Number(amount).toFixed(2);

}


// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(dateString) {

  const date =
    new Date(dateString);

  return date.toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric"
    }
  );

}


// ==========================================
// UPDATE TOTAL
// ==========================================

function updateTotal() {

  if (totalSavedElement) {

    totalSavedElement.textContent =
      formatMoney(totalSaved);

  }

  updateDashboard();

}


// ==========================================
// HISTORY
// ==========================================

function addHistory(type, amount) {

  history.unshift({

    id: Date.now(),

    type: type,

    amount: Number(amount),

    date: new Date().toISOString()

  });


  history =
    history.slice(0, 100);


  saveData();

}


function renderHistory() {

  const historyContainer =
    document.getElementById(
      "historyList"
    );


  if (!historyContainer) return;


  historyContainer.innerHTML = "";


  if (history.length === 0) {

    historyContainer.innerHTML = `

      <div class="empty">

        <h3>No activity yet</h3>

        <p>
          Your savings activity will appear here.
        </p>

      </div>

    `;

    return;

  }


  history.forEach(function(item) {

    const row =
      document.createElement("div");


    row.className =
      "history-item";


    const isAdd =
      item.type === "add";


    row.innerHTML = `

      <div class="history-icon ${
        isAdd
          ? "positive"
          : "negative"
      }">

        ${isAdd ? "+" : "−"}

      </div>


      <div class="history-info">

        <strong>
          ${
            isAdd
              ? "Money Added"
              : "Money Taken Out"
          }
        </strong>

        <small>
          ${formatDate(item.date)}
        </small>

      </div>


      <div class="history-amount ${
        isAdd
          ? "positive-text"
          : "negative-text"
      }">

        ${isAdd ? "+" : "−"}
        ${formatMoney(item.amount)}

      </div>

    `;


    historyContainer.appendChild(row);

  });

}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

  const totalGoals =
    goals.length;


  const completedGoals =
    goals.filter(function(goal) {

      return Number(goal.saved) >=
        Number(goal.amount);

    }).length;


  const totalGoalAmount =
    goals.reduce(
      function(total, goal) {

        return total +
          Number(goal.amount);

      },
      0
    );


  const totalGoalSaved =
    goals.reduce(
      function(total, goal) {

        return total +
          Number(goal.saved);

      },
      0
    );


  const totalContributed =
    history
      .filter(function(item) {

        return item.type === "add";

      })
      .reduce(
        function(total, item) {

          return total +
            Number(item.amount);

        },
        0
      );


  let bestProgress = 0;


  goals.forEach(function(goal) {

    if (
      Number(goal.amount) > 0
    ) {

      const percentage =
        Math.min(
          (
            Number(goal.saved) /
            Number(goal.amount)
          ) * 100,
          100
        );


      if (
        percentage >
        bestProgress
      ) {

        bestProgress =
          percentage;

      }

    }

  });


  const overallProgress =
    totalGoalAmount > 0
      ? Math.min(
          (
            totalGoalSaved /
            totalGoalAmount
          ) * 100,
          100
        )
      : 0;


  // TOTAL GOALS

  const totalGoalsElement =
    document.getElementById(
      "totalGoals"
    );

  if (totalGoalsElement) {

    totalGoalsElement.textContent =
      totalGoals;

  }


  // COMPLETED GOALS

  const completedElement =
    document.getElementById(
      "completedGoals"
    );

  if (completedElement) {

    completedElement.textContent =
      completedGoals;

  }


  // CONTRIBUTED

  const contributedElement =
    document.getElementById(
      "totalContributed"
    );

  if (contributedElement) {

    contributedElement.textContent =
      formatMoney(
        totalContributed
      );

  }


  // BEST PROGRESS

  const bestProgressElement =
    document.getElementById(
      "bestProgress"
    );

  if (bestProgressElement) {

    bestProgressElement.textContent =
      Math.round(
        bestProgress
      ) + "%";

  }


  // OVERALL %

  const overallPercentElement =
    document.getElementById(
      "overallProgressPercent"
    );

  if (overallPercentElement) {

    overallPercentElement.textContent =
      Math.round(
        overallProgress
      ) + "%";

  }


  // CIRCLE %

  const circleElement =
    document.getElementById(
      "overallProgressCircle"
    );

  if (circleElement) {

    circleElement.textContent =
      Math.round(
        overallProgress
      ) + "%";

  }


  // PROGRESS BAR

  const progressBar =
    document.getElementById(
      "overallProgressBar"
    );

  if (progressBar) {

    progressBar.style.width =
      overallProgress + "%";

  }


  // PROGRESS TEXT

  const progressText =
    document.getElementById(
      "overallProgressText"
    );

  if (progressText) {

    if (totalGoals === 0) {

      progressText.textContent =
        "Create a goal to start tracking progress.";

    } else {

      progressText.textContent =
        formatMoney(
          totalGoalSaved
        ) +
        " saved toward your goals";

    }

  }


  // DASHBOARD MESSAGE

  const message =
    document.getElementById(
      "dashboardMessage"
    );


  if (message) {

    if (totalGoals === 0) {

      message.textContent =
        "Create your first goal and start saving.";

    }

    else if (
      completedGoals === totalGoals
    ) {

      message.textContent =
        "🎉 You reached all your goals!";

    }

    else if (
      overallProgress >= 75
    ) {

      message.textContent =
        "🔥 You're almost there!";

    }

    else if (
      overallProgress >= 50
    ) {

      message.textContent =
        "💪 You're halfway there!";

    }

    else if (
      overallProgress > 0
    ) {

      message.textContent =
        "Keep going. You're making progress!";

    }

    else {

      message.textContent =
        "Your savings journey starts here.";

    }

  }


  renderRecentActivity();

}


// ==========================================
// RECENT ACTIVITY
// ==========================================

function renderRecentActivity() {

  const container =
    document.getElementById(
      "recentActivity"
    );


  if (!container) return;


  container.innerHTML = "";


  const recent =
    history.slice(0, 3);


  if (recent.length === 0) {

    container.innerHTML = `

      <div class="recent-empty">

        No activity yet.
        Add some money to get started.

      </div>

    `;

    return;

  }


  recent.forEach(function(item) {

    const isAdd =
      item.type === "add";


    const row =
      document.createElement("div");


    row.className =
      "recent-activity-item";


    row.innerHTML = `

      <div class="recent-activity-icon ${
        isAdd
          ? "add"
          : "take"
      }">

        ${isAdd ? "+" : "−"}

      </div>


      <div class="recent-activity-info">

        <strong>
          ${
            isAdd
              ? "Money Added"
              : "Money Taken Out"
          }
        </strong>

        <small>
          ${formatDate(item.date)}
        </small>

      </div>


      <div class="recent-activity-amount ${
        isAdd
          ? "positive-text"
          : "negative-text"
      }">

        ${isAdd ? "+" : "−"}
        ${formatMoney(item.amount)}

      </div>

    `;


    container.appendChild(row);

  });

}


// ==========================================
// GOALS
// ==========================================

function renderGoals() {

  if (!goalsContainer) return;


  goalsContainer.innerHTML = "";


  if (goals.length === 0) {

    goalsContainer.innerHTML = `

      <div class="empty">

        <h3>No goals yet</h3>

        <p>
          Create your first savings goal.
        </p>

      </div>

    `;

    renderGoalsPage();

    updateDashboard();

    return;

  }


  goals.forEach(function(goal) {

    const percentage =
      goal.amount > 0
        ? Math.min(
            (
              goal.saved /
              goal.amount
            ) * 100,
            100
          )
        : 0;


    const goalElement =
      document.createElement("div");


    goalElement.className =
      "goal";


    goalElement.innerHTML = `

      <div class="goal-top">

        <div>

          <div class="goal-name">

            ${escapeHTML(goal.name)}

          </div>


          <div class="goal-amount">

            ${formatMoney(goal.saved)}
            saved of
            ${formatMoney(goal.amount)}

          </div>

        </div>

      </div>


      <div class="progress">

        <div
          class="progress-bar"
          style="width: ${percentage}%"
        ></div>

      </div>


      <div class="goal-bottom">

        <div class="goal-percent">

          ${Math.round(percentage)}%

        </div>


        <div class="goal-actions">

          <button
            onclick="addToGoal(${goal.id})"
          >
            + Money
          </button>


          <button
            onclick="editGoal(${goal.id})"
          >
            Edit
          </button>


          <button
            onclick="deleteGoal(${goal.id})"
          >
            Delete
          </button>

        </div>

      </div>

    `;


    goalsContainer.appendChild(
      goalElement
    );

  });


  renderGoalsPage();

  updateDashboard();

}


// ==========================================
// GOALS PAGE
// ==========================================

function renderGoalsPage() {

  const list =
    document.getElementById(
      "goalsPageList"
    );


  if (!list) return;


  list.innerHTML = "";


  if (goals.length === 0) {

    list.innerHTML = `

      <div class="empty">

        <h3>No goals yet</h3>

        <p>
          Create a goal to start saving.
        </p>

      </div>

    `;

    return;

  }


  goals.forEach(function(goal) {

    const percentage =
      goal.amount > 0
        ? Math.min(
            (
              goal.saved /
              goal.amount
            ) * 100,
            100
          )
        : 0;


    const card =
      document.createElement("div");


    card.className =
      "goal";


    card.innerHTML = `

      <div class="goal-name">

        ${escapeHTML(goal.name)}

      </div>


      <div class="goal-amount">

        ${formatMoney(goal.saved)}
        saved of
        ${formatMoney(goal.amount)}

      </div>


      <div class="progress">

        <div
          class="progress-bar"
          style="width: ${percentage}%"
        ></div>

      </div>


      <div class="goal-bottom">

        <span class="goal-percent">

          ${Math.round(percentage)}%

        </span>


        <div class="goal-actions">

          <button
            onclick="addToGoal(${goal.id})"
          >
            + Money
          </button>


          <button
            onclick="editGoal(${goal.id})"
          >
            Edit
          </button>


          <button
            onclick="deleteGoal(${goal.id})"
          >
            Delete
          </button>

        </div>

      </div>

    `;


    list.appendChild(card);

  });

}


// ==========================================
// NAVIGATION
// ==========================================

function showScreen(screenId) {

  const screens = [

    homeScreen,

    goalsScreen,

    addScreen,

    settingsScreen

  ];


  screens.forEach(function(screen) {

    if (screen) {

      screen.classList.add(
        "hidden-screen"
      );

    }

  });


  const selected =
    document.getElementById(
      screenId
    );


  if (selected) {

    selected.classList.remove(
      "hidden-screen"
    );

  }


  document
    .querySelectorAll(".nav-button")
    .forEach(function(button) {

      button.classList.remove(
        "active"
      );


      if (
        button.dataset.screen ===
        screenId
      ) {

        button.classList.add(
          "active"
        );

      }

    });


  if (
    screenId ===
    "settingsScreen"
  ) {

    renderHistory();

  }

}


// ==========================================
// NAV BUTTONS
// ==========================================

document
  .querySelectorAll(".nav-button")
  .forEach(function(button) {

    button.addEventListener(
      "click",
      function() {

        showScreen(
          button.dataset.screen
        );

      }
    );

  });


// ==========================================
// VIEW ALL ACTIVITY
// ==========================================

const viewActivityButton =
  document.getElementById(
    "viewActivityBtn"
  );


if (viewActivityButton) {

  viewActivityButton.addEventListener(
    "click",
    function() {

      showScreen(
        "settingsScreen"
      );

    }
  );

}


// ==========================================
// CREATE GOAL
// ==========================================

function openGoalModal() {

  goalNameInput.value = "";

  goalAmountInput.value = "";


  goalModal.classList.remove(
    "hidden"
  );


  goalNameInput.focus();

}


const newGoalButton =
  document.getElementById(
    "newGoalBtn"
  );


if (newGoalButton) {

  newGoalButton.addEventListener(
    "click",
    openGoalModal
  );

}


const goalsAddButton =
  document.getElementById(
    "goalsAddButton"
  );


if (goalsAddButton) {

  goalsAddButton.addEventListener(
    "click",
    openGoalModal
  );

}


const cancelGoalButton =
  document.getElementById(
    "cancelGoalBtn"
  );


if (cancelGoalButton) {

  cancelGoalButton.addEventListener(
    "click",
    function() {

      goalModal.classList.add(
        "hidden"
      );

    }
  );

}


const saveGoalButton =
  document.getElementById(
    "saveGoalBtn"
  );


if (saveGoalButton) {

  saveGoalButton.addEventListener(
    "click",
    function() {

      const name =
        goalNameInput.value.trim();


      const amount =
        Number(
          goalAmountInput.value
        );


      if (!name) {

        alert(
          "Enter a goal name."
        );

        return;

      }


      if (
        !amount ||
        amount <= 0
      ) {

        alert(
          "Enter a valid goal amount."
        );

        return;

      }


      goals.push({

        id: Date.now(),

        name: name,

        amount: amount,

        saved: 0

      });


      saveData();

      renderGoals();

      updateDashboard();


      goalModal.classList.add(
        "hidden"
      );

    }
  );

}


// ==========================================
// MONEY MODAL
// ==========================================

function openMoneyModal(mode) {

  moneyMode =
    mode;


  if (mode === "add") {

    moneyTitle.textContent =
      "Add Money";

    confirmMoneyBtn.textContent =
      "Add Money";

  } else {

    moneyTitle.textContent =
      "Take Money Out";

    confirmMoneyBtn.textContent =
      "Take Money";

  }


  moneyAmountInput.value = "";


  moneyModal.classList.remove(
    "hidden"
  );


  moneyAmountInput.focus();

}


const addMoneyButton =
  document.getElementById(
    "addMoneyBtn"
  );


if (addMoneyButton) {

  addMoneyButton.addEventListener(
    "click",
    function() {

      openMoneyModal(
        "add"
      );

    }
  );

}


const takeMoneyButton =
  document.getElementById(
    "takeMoneyBtn"
  );


if (takeMoneyButton) {

  takeMoneyButton.addEventListener(
    "click",
    function() {

      openMoneyModal(
        "take"
      );

    }
  );

}


const openAddMoneyPage =
  document.getElementById(
    "openAddMoneyPage"
  );


if (openAddMoneyPage) {

  openAddMoneyPage.addEventListener(
    "click",
    function() {

      openMoneyModal(
        "add"
      );

    }
  );

}


const cancelMoneyButton =
  document.getElementById(
    "cancelMoneyBtn"
  );


if (cancelMoneyButton) {

  cancelMoneyButton.addEventListener(
    "click",
    function() {

      moneyModal.classList.add(
        "hidden"
      );

    }
  );

}


// ==========================================
// CONFIRM MONEY
// ==========================================

if (confirmMoneyBtn) {

  confirmMoneyBtn.addEventListener(
    "click",
    function() {

      const amount =
        Number(
          moneyAmountInput.value
        );


      if (
        !amount ||
        amount <= 0
      ) {

        alert(
          "Enter a valid amount."
        );

        return;

      }


      if (
        moneyMode === "add"
      ) {

        totalSaved +=
          amount;


        addHistory(
          "add",
          amount
        );

      }

      else {

        if (
          amount >
          totalSaved
        ) {

          alert(
            "You don't have that much saved."
          );

          return;

        }


        totalSaved -=
          amount;


        addHistory(
          "take",
          amount
        );

      }


      saveData();

      updateTotal();

      renderGoals();

      renderHistory();


      moneyModal.classList.add(
        "hidden"
      );

    }
  );

}


// ==========================================
// ADD MONEY TO GOAL
// ==========================================

function addToGoal(id) {

  const goal =
    goals.find(function(item) {

      return item.id === id;

    });


  if (!goal) return;


  if (
    goal.saved >=
    goal.amount
  ) {

    alert(
      "This goal is already complete!"
    );

    return;

  }


  const amount =
    Number(
      prompt(
        `How much do you want to add to "${goal.name}"?`
      )
    );


  if (
    !amount ||
    amount <= 0
  ) {

    return;

  }


  if (
    amount >
    totalSaved
  ) {

    alert(
      "You don't have enough money saved."
    );

    return;

  }


  const remaining =
    Number(goal.amount) -
    Number(goal.saved);


  const amountToAdd =
    Math.min(
      amount,
      remaining
    );


  goal.saved +=
    amountToAdd;


  totalSaved -=
    amountToAdd;


  saveData();

  updateTotal();

  renderGoals();

  renderHistory();


  alert(
    `${formatMoney(amountToAdd)} added to ${goal.name}!`
  );

}


// ==========================================
// EDIT GOAL
// ==========================================

function editGoal(id) {

  const goal =
    goals.find(function(item) {

      return item.id === id;

    });


  if (!goal) return;


  const newName =
    prompt(
      "Goal name:",
      goal.name
    );


  if (
    newName === null
  ) {

    return;

  }


  const newAmount =
    Number(
      prompt(
        "Goal amount:",
        goal.amount
      )
    );


  if (
    !newAmount ||
    newAmount <= 0
  ) {

    alert(
      "Enter a valid amount."
    );

    return;

  }


  if (
    newAmount <
    goal.saved
  ) {

    alert(
      "The goal amount can't be less than the amount already saved."
    );

    return;

  }


  goal.name =
    newName.trim() ||
    goal.name;


  goal.amount =
    newAmount;


  saveData();

  renderGoals();

  updateDashboard();

}


// ==========================================
// DELETE GOAL
// ==========================================

function deleteGoal(id) {

  const goal =
    goals.find(function(item) {

      return item.id === id;

    });


  if (!goal) return;


  const confirmed =
    confirm(
      `Delete "${goal.name}"?`
    );


  if (!confirmed) {

    return;

  }


  // Return the goal's saved money
  // to the main balance.

  totalSaved +=
    Number(goal.saved);


  goals =
    goals.filter(function(item) {

      return item.id !== id;

    });


  saveData();

  updateTotal();

  renderGoals();

  renderHistory();

}


// ==========================================
// MODAL BACKDROP
// ==========================================

if (goalModal) {

  goalModal.addEventListener(
    "click",
    function(event) {

      if (
        event.target ===
        goalModal
      ) {

        goalModal.classList.add(
          "hidden"
        );

      }

    }
  );

}


if (moneyModal) {

  moneyModal.addEventListener(
    "click",
    function(event) {

      if (
        event.target ===
        moneyModal
      ) {

        moneyModal.classList.add(
          "hidden"
        );

      }

    }
  );

}


// ==========================================
// ENTER KEY
// ==========================================

if (goalNameInput) {

  goalNameInput.addEventListener(
    "keydown",
    function(event) {

      if (
        event.key ===
        "Enter"
      ) {

        if (saveGoalButton) {

          saveGoalButton.click();

        }

      }

    }
  );

}


if (goalAmountInput) {

  goalAmountInput.addEventListener(
    "keydown",
    function(event) {

      if (
        event.key ===
        "Enter"
      ) {

        if (saveGoalButton) {

          saveGoalButton.click();

        }

      }

    }
  );

}


if (moneyAmountInput) {

  moneyAmountInput.addEventListener(
    "keydown",
    function(event) {

      if (
        event.key ===
        "Enter"
      ) {

        if (confirmMoneyBtn) {

          confirmMoneyBtn.click();

        }

      }

    }
  );

}


// ==========================================
// ESCAPE MODALS
// ==========================================

document.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key !== "Escape"
    ) {

      return;

    }


    if (goalModal) {

      goalModal.classList.add(
        "hidden"
      );

    }


    if (moneyModal) {

      moneyModal.classList.add(
        "hidden"
      );

    }

  }
);


// ==========================================
// SECURITY
// ==========================================

function escapeHTML(text) {

  return String(text)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}


// ==========================================
// START APP
// ==========================================

updateTotal();

renderGoals();

renderHistory();

updateDashboard();

showScreen(
  "homeScreen"
);