# RealHome Bot (Demo)

Discord bot that called **RealHome Bot**, or **RealBot** for short, coded in [Typescript][ts] with [discord.js][djs] and [MongoDB][mongo] by [Disezmike][itsme]

> If you get any bugs please contact [me][itsme] !

## Feature Commands

-   👍 General : `ping` `currency` `help` `detail` `setup` !

-   🎵 Music : `play` `skip` `queue` `clear` `leave` !

---

## Getting started ✨

Install a [Git](https://git-scm.com/downloads) and [Docker](https://www.docker.com/products/docker-desktop/) or in command line.

```shell
sudo apt-get install git-all
sudo apt install docker.io
```

then, check the version

```shell
git --version
```

```shell
docker --version
```

If it works, it will show version.

**Set up database**
Realbot uses MongoDB as its Database.
First, go to the [Mongodb website](https://www.mongodb.com) and click Sign In at the top right of page.

[![Mongodb website](https://i.postimg.cc/hjXDVZG8/image.png)](https://postimg.cc/mzGWswCh)

Choose your preferred sign-in method.

[![sign in page](https://i.postimg.cc/kX3SXKjY/image.png)](https://postimg.cc/mhjkmzW7)

For first time account you need to accept the Privacy Policy and the Terms of Service. Check and submit.

[![image.png](https://i.postimg.cc/RhJynGWY/image.png)](https://postimg.cc/XB3QRfcK)
[![image.png](https://i.postimg.cc/G2TnkbNz/image.png)](https://postimg.cc/tZbcbG9V)

select Shared option and **Create Cluster**.

[![image.png](https://i.postimg.cc/tJGwWWFC/image.png)](https://postimg.cc/mzVmGcd0)
[![image.png](https://i.postimg.cc/P5CyfN86/image.png)](https://postimg.cc/fVhmBzCX)

Set your username and password for connect to the database. Click **Create User**.

> Recommended username should not be changed.

[![image.png](https://i.postimg.cc/sfK4p5Y6/image.png)](https://postimg.cc/vDgnygSf)

Then, go to a Database page and click to Connect button

[![image.png](https://i.postimg.cc/rF101T28/image.png)](https://postimg.cc/XpvYWTvh)

In the add a connection IP address, click a Allow Access from Anywhere and Add IP Address. Click **Choose a connection method** button.

[![image.png](https://i.postimg.cc/cJrLby2t/image.png)](https://postimg.cc/WDcVdK2s)

Select to **Connect your application**.

[![image.png](https://i.postimg.cc/T1R8Bn1N/image.png)](https://postimg.cc/JDddkDbj)

Choose **2.2.12 or later** version, then copy a URL.

[![image.png](https://i.postimg.cc/8PLGsPQb/image.png)](https://postimg.cc/RNCyDm03)

**Clone a repository**

```shell
git clone https://github.com/DisEzMike/Realbot-demo.git realbot-demo
cd realbot-demo
```

config a **.env** file

```shell
sudo nano .env
```

    DB_NAME=SET_YOUR_DATABASE_NAME
    MONGO_URL=mongodb://admin:<password>@ac-0fi7cmn-shard-00-00.beewe6u.mongodb.net:27017....
    TOKEN=YOUR_BOT_TOKEN
    fileType=.ts

> Don't forget in MONDODB_URL change a \<password> to your password

Then, exit the file and back to command line to build a code to **Docker**

```shell
sudo docker build -t realbot:demo .
```

After build, run.

```shell
sudo docker run realbot:demo
```

If it works, it will show :

[![image.png](https://i.postimg.cc/MHcNQwPx/image.png)](https://postimg.cc/ctSXppG5)

### Done!

---

### Patch Note🔥

> **v0.1.0**

>

> -   start the project with [discord.js][djs]

> -   use Database via [MongoDB][mongo]

> -   `Command` and `Event` handlers

> -   general event `Ready` `InteractionCreate`

> -   add `/ping` `/help` `/currency` commands

> -   add Music feature using [Discord-player][dpjs]

> -   basic music events `error` `trackStart` `trackAdd` etc.

> -   basic music commands `/play` `/skip` `/queue` `/clear` `/leave`

---

> **v0.1.1**

>

> -   add `/detail` command for show bot details

---

> **v0.2.0**

>

> -   use **Docker**

> -   add command `/setup` can use types `Greeting Room` `Music Room`

> -   specific channel for Greeing Room via `/setup type:Greeing Room`

> -   specific channel for Realbot Music via `/setup type:Music Room`

---

> **v0.2.1** (DEMO)

>

> -   type any URL or keyword to Realbot Music specific channel to play a music (playlist support)

> -   in the Greeting room that whenever a user joins or leaves the server, Realbot will send message to this room

---

[itsme]: https://github.com/disezmike
[ts]: https://www.typescriptlang.org/
[djs]: https://discord.js.org
[dpjs]: https://discord-player.js.org
[mongo]: https://www.npmjs.com/package/mongodb
