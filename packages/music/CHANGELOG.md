# Stage

# [v4.0.0](https://github.com/oceanroleplay/discord.ts/releases/tag/m-v4.0.0) (2022-04-04)

## Changed

- remove spotify from music ([9f7b9e](https://github.com/oceanroleplay/discord.ts/commit/9f7b9efac78e52743dbc10720ef56b3cc3a67499))
- remove spotify support ([bf3ad8](https://github.com/oceanroleplay/discord.ts/commit/bf3ad812e8c48c3e75a5c00aad694f83d6255dc2))
- typo ([#535](https://github.com/oceanroleplay/discord.ts/issues/535)) ([356697](https://github.com/oceanroleplay/discord.ts/commit/356697e0af3e8db832d80d38d671f7e75eae68aa))
- params ([#527](https://github.com/oceanroleplay/discord.ts/issues/527)) ([b613a1](https://github.com/oceanroleplay/discord.ts/commit/b613a1dc806cefb272e8f0ae19f82d7dc137ab9e))
- sort imports ([fb5b0f](https://github.com/oceanroleplay/discord.ts/commit/fb5b0f82661313a4e9e6638db71670a7fb524ac2))

## Fixed

- repeat mode ([84865e](https://github.com/oceanroleplay/discord.ts/commit/84865e70ad79bac55b527446158f1a422a4cc4d5))
- volume ([7ff7b6](https://github.com/oceanroleplay/discord.ts/commit/7ff7b62845c32bdc91857a3bfa07c8dd3cd1bf0e))
- volume should persist between tracks ([#461](https://github.com/oceanroleplay/discord.ts/issues/461)) ([e876c2](https://github.com/oceanroleplay/discord.ts/commit/e876c25ef025665399ec6ce40ffcc30eb9fe5b21))
- .setVolume() not working in custom tracks ([#444](https://github.com/oceanroleplay/discord.ts/issues/444)) ([f11b83](https://github.com/oceanroleplay/discord.ts/commit/f11b8312507b4274c264fe9ad959a3e7de76f505))
- music - do not catch unwanted errors ([d934c9](https://github.com/oceanroleplay/discord.ts/commit/d934c9986306095891a51b0f7c9fe25b0f9337b6))

## Routine Tasks

- format ([04bf10](https://github.com/oceanroleplay/discord.ts/commit/04bf101659fc1ce75de8d7b2b87578181586d2b9))
- set default volume to 1 ([8ce167](https://github.com/oceanroleplay/discord.ts/commit/8ce16753c930b00dff2e5a5c55d04de2103e38c0))
- seperate lava player ([9ad3b4](https://github.com/oceanroleplay/discord.ts/commit/9ad3b4c3fcac0f23b4a6bf998d3cd413092f7cff))
- repo cleanup ([3ee0df](https://github.com/oceanroleplay/discord.ts/commit/3ee0df074f23651c26bdbee49f0cbe859967e31e))

# [v3.1.0](https://github.com/oceanroleplay/discord.ts/releases/tag/m-v3.1.0) (2021-12-24)

## Breaking Changes

- move to esm ([#256](https://github.com/oceanroleplay/discord.ts/issues/256)) ([f5476b](https://github.com/oceanroleplay/discord.ts/commit/f5476b61ab5a9f7b1cfb6f3593f7efe14c1ed424))

## Features

- add inline volume ([c0e252](https://github.com/oceanroleplay/discord.ts/commit/c0e25295bfd5b91f1f3fa5798631bd259978099e))

## Changed

- change ID to Id ([62e9ec](https://github.com/oceanroleplay/discord.ts/commit/62e9ec69ea813796d1373a8a5cebd02ad5bd03db))

## Routine Tasks

- revert extension (mts) ([#267](https://github.com/oceanroleplay/discord.ts/issues/267)) ([6a05e4](https://github.com/oceanroleplay/discord.ts/commit/6a05e4ab5e94e57d1c28641eaff17eca81885a06))
- readme and package ([069562](https://github.com/oceanroleplay/discord.ts/commit/06956230dabb5f56e37783666549b0737359968a))

# [v3.0.9](https://github.com/oceanroleplay/discord.ts/releases/tag/m-v3.0.9) (2021-11-11)

## Features

- add duration filed in custom track ([3d68e2](https://github.com/oceanroleplay/discord.ts/commit/3d68e2ac6528be14d505bdb213a2e61c04d6513d))
- esm support ([#222](https://github.com/oceanroleplay/discord.ts/issues/222)) ([70c209](https://github.com/oceanroleplay/discord.ts/commit/70c209b967b9786ce0b4caf1762a7e05163bda0c))
- secure option for lava player ([c40248](https://github.com/oceanroleplay/discord.ts/commit/c402487ac291c8104673bb3b469d2ef0757a1cc3))
- music: add lavalink support ([2b7006](https://github.com/oceanroleplay/discord.ts/commit/2b7006512739b4601c368cece144ce2b52ba005e))
- music: getSongs ([a89999](https://github.com/oceanroleplay/discord.ts/commit/a89999366f8ba73cdacbb0db31be3c3bf8f844c2))

## Changed

- music ([b4b810](https://github.com/oceanroleplay/discord.ts/commit/b4b810fe11987061dfe470194b7cad304d1a5711))
- music: update directory ([22063c](https://github.com/oceanroleplay/discord.ts/commit/22063cb299693e91a24fcb9286e2175ed3f753dd))
- music: change filestructure ([1dd1a7](https://github.com/oceanroleplay/discord.ts/commit/1dd1a74220c9487d50fa9c97a62ba4d90c45fec6))

## Fixed

- music queue ([235688](https://github.com/oceanroleplay/discord.ts/commit/235688073e19bf0452dc83596caaeb3f7c959d3a))
- music: leave ([227f83](https://github.com/oceanroleplay/discord.ts/commit/227f835782fd414c2fe3e5cd016ad6fb16f81c65))
- music event arg ([e3465f](https://github.com/oceanroleplay/discord.ts/commit/e3465fdb2d96627fba2d11e0c4e91275ae8d6fa1))
- music queue getter tracks ([851ccf](https://github.com/oceanroleplay/discord.ts/commit/851ccf26eb16a11d7f3ae27265b168bab5cf1d96))
- join group config ([500710](https://github.com/oceanroleplay/discord.ts/commit/500710b6bbe667ca2b2e13947dea0a93ca4323cf))
- seek and track methods ([9ee056](https://github.com/oceanroleplay/discord.ts/commit/9ee056c97dbd7e1fece6904530e45a19dc3bf69c))

## Routine Tasks

- music: comment util ([c4cbba](https://github.com/oceanroleplay/discord.ts/commit/c4cbba3aef265c256a2ae279bedf7dd7b9497f86))
- number improvements ([9b38ee](https://github.com/oceanroleplay/discord.ts/commit/9b38eed20236075a962aa2cfb1c22adff1060a2f))
- music: type: spotify input ([b55d82](https://github.com/oceanroleplay/discord.ts/commit/b55d82b9af2e6fffe9c7c3d628784cb5e3759d2d))
- music: search options ([05078d](https://github.com/oceanroleplay/discord.ts/commit/05078dcc7efedc575c8bca8178bb594c2bbdfbe5))

## Untagged

- Update README.md ([8c9e48](https://github.com/oceanroleplay/discord.ts/commit/8c9e48290c8d38417348dd6b9de50737f5a37a7d))
- feat(music): add search ([917150](https://github.com/oceanroleplay/discord.ts/commit/917150d6b61149069f4c381606d16be1b29bc4ac))
- music: add enqueueTop + fix playTack ([a2cad6](https://github.com/oceanroleplay/discord.ts/commit/a2cad6e41ea527e7a27d6b0b0d7a4e82aba24b9b))
- musci: move toString ([924910](https://github.com/oceanroleplay/discord.ts/commit/92491024ce0dc67b6f9d915430f407060a618c42))
- music: fix currentTrack ([50a458](https://github.com/oceanroleplay/discord.ts/commit/50a458fbce589b61d044d31e0e29af6bd9abd014))
- music: add user to tracks ([0661c2](https://github.com/oceanroleplay/discord.ts/commit/0661c2b283e3737fc233a47d0ebc28f515df55d9))
- music: fix type ([76016d](https://github.com/oceanroleplay/discord.ts/commit/76016d7e64e4b67a4c879f369a13a1abcdec8dd6))
- music: custom player, queue ([6d891b](https://github.com/oceanroleplay/discord.ts/commit/6d891b2d15e15e2243eaee7f2bf1fb6eb7450cfb))
- music: add event onJoin, onLeave ([125195](https://github.com/oceanroleplay/discord.ts/commit/12519546226ccf031949402bf918b5ddc64731ff))
- music: remove console log ([3ef586](https://github.com/oceanroleplay/discord.ts/commit/3ef5866efa659065018316a2906e05974cac7cf3))
- music: expose more getters ([e11e06](https://github.com/oceanroleplay/discord.ts/commit/e11e06fdda4c796e69540cb2801450d9ac40d14b))
- eslint: sort interface ([59a319](https://github.com/oceanroleplay/discord.ts/commit/59a319e48296fb3bf30ecf242c5e8dfde2a245a5))
- music: custom resource ([743bdf](https://github.com/oceanroleplay/discord.ts/commit/743bdf6078bf55b2a7533b3ea6635b37007686cb))
- music: example ([39d2e3](https://github.com/oceanroleplay/discord.ts/commit/39d2e3a87bd29c9cff5024ee870a7dbeaa8fe371))
- music: fix imports ([558e87](https://github.com/oceanroleplay/discord.ts/commit/558e87e1d5dbf43d699ecca27563c8dcfeec5a92))
- music: improve event ([b9212a](https://github.com/oceanroleplay/discord.ts/commit/b9212a95a5ad83f5781284472c6aa9ed847d4d42))
- music: events ([4c98b5](https://github.com/oceanroleplay/discord.ts/commit/4c98b54605d288716a7319a4734e9c2ce54cc9c8))
- music: clearTracks, removeTracks ([18df07](https://github.com/oceanroleplay/discord.ts/commit/18df07323302cf5d70262c8eb2015e6649b3a0ff))
- music: seek, volume ([4861af](https://github.com/oceanroleplay/discord.ts/commit/4861af90b06bab6ec66e06add2bf83c09a36c933))
- @discordx/music ([9db20b](https://github.com/oceanroleplay/discord.ts/commit/9db20b4095097cd5fc63fc0c2002b9eb6e6db9d4))
