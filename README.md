# Zeitkit

[ ![Codeship Status for ZEITIO/zeitkit](https://app.codeship.com/projects/69fd01f0-67fd-0135-baf2-1ed4579c2b28/status)](https://app.codeship.com/projects/241143)


The goal of Zeitkit has been to develop a super simple time tracking software that is highly adjusted to the needs of developers.

* Track time for your clients
* Write detailed descriptions of what you have done
* Organize clients
* Write monthly invoices based on your worked times
* Manage a whole team with shared clients
* Reporting to see how your team is doing
* Fully fledged PDF invoice generation. 100% compliant with German law.
* View the demo: [https://zeitkit.herokuapp.com/](https://zeitkit.herokuapp.com/)

## Screenshots

### Tracking time
![Alt text](http://i.imgur.com/KapBXcr.png "Shared clients feature")

### Shared clients feature
![Shared clients](http://i.imgur.com/SyOhK2I.png "Shared clients feature")

### Invoicing Feature
![Invoicing Feature](http://i.imgur.com/Sg7f8Cz.png "Invoicing feature")


## Setup

Prerequisite: 
* Ruby 2.2.2
* Postgresql 9.3+
* Redis server
* [rbenv-vars](https://github.com/rbenv/rbenv-vars)

Make sure you have mailcatcher installed:

```shell
gem install mailcatcher
# Start mailcatcher
mailcatcher
```

Install all ruby gems:

```ruby
bundle install
```

Start everything:

```shell
bundle exec rails s
```

Open the app:

```
http://localhost:3000
```

## TODO
* Session store should be configurable with an environment variable REDIS_SESSION_STORE
