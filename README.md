# tononkira
A API to fetch lyrics of malagasy from [tononkira.serasera.org](https://tononkira.serasera.org/)

The different endpoints are:
#### `/songs/`
To get list of all available songs
#### `/songs/:artist`
To get list of availlable songs of the `:artist`
#### `/songs/:artist/:title`
To get lyrics of the specified song
#### `/search/:title`
To search a specified song
#### `/artists/`
To get list of artist
#### `/artists/:name`
Te get info of the artist

You can also use these parameters
#### `?from=`
To specified where to start the list `by default 0`
#### `?count=`
To specified the size of the list to get `by default 20`

