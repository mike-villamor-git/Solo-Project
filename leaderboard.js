const secrets = document.querySelector('#leaders');

fetch('/leaderboard.html/scores')
.then((res) => res.json())
.then((data) => {
  const users = data.users;

  users.sort((a,b) => (Number(a.score) > Number(b.score)) ? -1 : 1);


  users.forEach((user) => {
    const userListItem = document.createElement('li');
    userListItem.appendChild(document.createTextNode(`${user.name}: ${user.score}`));
    secrets.appendChild(userListItem);
  });
});

