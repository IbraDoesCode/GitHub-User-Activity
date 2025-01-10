#!/usr/bin/env node

const fetchUserActivity = async (username) => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events`
    );
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`${username} not found!`);
      } else {
        throw new Error(`Error fetching user activity: ${response.status}`);
      }
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching user activity for ${username}: `, error);
    throw error;
  }
};

const displayUserActivity = (data) => {
  if (!data || data.length === 0) {
    console.log("No user activity found");
    return;
  }

  data.forEach((event) => {
    let activity;
    switch (event.type) {
      case "PushEvent":
        activity = `Pushed ${event.payload.commits.length} commits to ${event.repo.name}`;
        break;

      case "IssuesEvent":
        activity = `Opened a new issue in ${event.repo.name}`;
        break

      case "WatchEvent":
        activity = `Starred the repository ${event.repo.name}`;
        break

      case "CreateEvent":
        activity = `Created a new ${event.payload.ref_type} in ${event.repo.name}`;
        break

      case 'ForkEvent':
        activity = `Forked ${event.repo.name} repository`
        break

      default:
        activity = `- ${event.type}`
        break;
    }

    console.log(activity);
  });
};


const username = process.argv[2]
if (!username) {
    console.error('Please provide username')
    process.exit
}

fetchUserActivity(username)
    .then(data => displayUserActivity(data))
    .catch(err => console.error(err))

