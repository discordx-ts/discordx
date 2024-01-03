---
title: "@SlashGroup"
---

Subcommands and groups offer developers an organized and complex way to group commands.

## Blueprint

> We call this grouping Level 1

```
command
|
|__ subcommand
|
|__ subcommand

```

> We call this grouping Level 2

```
command
|
|__ subcommand-group
    |
    |__ subcommand
|
|__ subcommand-group
    |
    |__ subcommand
```

## Signature

```ts
// Create a new group or subgroup
SlashGroup(options: SlashGroupOptions): ClassDecoratorEx

// Assign slashes to a group
SlashGroup(name: string): ClassMethodDecorator

// Assign slashes to a subgroup
SlashGroup(name: string, root: string): ClassMethodDecorator
```

## Example

In the following example, slash permission commands are grouped under permissions and subgrouped by role and user.

![](../../../../static/img/permissions.png)

## Create a group

To create a slash group, you need a class decorated with @Discord. Selected class metadata such as botId, permissions, etc will be used to build slash group command.

### Group

We create a group with a selected class in the following code example

```ts
@Discord()
@SlashGroup({ description: "Manage permissions", name: "permission" })
class Example {
  //
}
```

### Subgroup

We create a group and subgroup with a selected class in the following code example

```ts
@Discord()
@SlashGroup({ description: "Manage permissions", name: "permission" })
@SlashGroup({
  description: "Manage permissions",
  name: "user",
  root: "permission", // need to specify root
})
class Example {
  //
}
```

## Assign a group

We have created a group in the above steps, It's time to assign our slash commands to group.

### Slashes can be added to a group in two ways

The following structure will be followed by our group

```
get
|
|__ role
|
|__ user
```

#### 1. Class Level

```ts
@Discord()
// Create a group
@SlashGroup({ description: "Get a role or user", name: "get" })
// Assign all inherit slashes to the group
@SlashGroup("get")
class Example {
  @Slash({ description: "role" })
  role() {
    // ...
  }

  @Slash({ description: "user" })
  user() {
    // ...
  }
}
```

#### 2. Method Level

```ts
@Discord()
// Create a group
@SlashGroup({ description: "Get a role or user", name: "get" })
class Example {
  @Slash({ description: "role" })
  // Assign slash to the group
  @SlashGroup("get")
  role() {
    // ...
  }

  @Slash({ description: "user" })
  // Assign slash to the group
  @SlashGroup("get")
  user() {
    // ...
  }
}
```

## Assign a subgroup

We have created a group and a subgroup in the above steps, It's time to assign our slash commands to groups.

### Slashes can be added to a group in two ways

The following structure will be followed by our group

```
permission
|
|__ user
    |
    |__ get
    |
    |__ set
```

#### 1. Class Level

```ts
@Discord()
// Create a group
@SlashGroup({ description: "Manage permissions", name: "permission" })
// Create a sub group
@SlashGroup({
  description: "User permissions",
  name: "user",
  root: "permission",
})
// Assign all inherit slashes to the subgroup
@SlashGroup("user", "permission")
class Example {
  @Slash({ description: "get" })
  get() {
    // ...
  }

  @Slash({ description: "set" })
  set() {
    // ...
  }
}
```

#### 2. Method Level

```ts
@Discord()
// Create a group
@SlashGroup({ description: "Manage permissions", name: "permission" })
// Create a sub group
@SlashGroup({
  description: "User permissions",
  name: "user",
  root: "permission",
})
class Example {
  @Slash({ description: "get" })
  // Assign slash to subgroup
  @SlashGroup("user", "permission")
  get() {
    // ...
  }

  @Slash({ description: "set" })
  // Assign slash to subgroup
  @SlashGroup("user", "permission")
  set() {
    // ...
  }
}
```

## Structure - Multiple Classes

It's sometimes difficult to use a single class for too many commands. We offer the flexibility to divide your group into multiple classes.

The following structure will be followed by our group

```
permission
|
|__ info
|
|__ user
    |
    |__ get
    |
    |__ set
|
|__ role
    |
    |__ get
    |
    |__ set
```

:::warning
Look closely at the code, only Permission class is used to create slash group, all other classes are children.

Other slashes class metadata won't be used and will be overwritten by the root class.
:::

```ts
@Discord()
// Create a group
@SlashGroup({ description: "Manage permissions", name: "permission" })
// Assign all inherit slashes to the subgroup
@SlashGroup("permission")
class Permission {
  @Slash({ description: "info" })
  info() {
    // ...
  }
}
```

```ts
@Discord()
// Create a sub group
@SlashGroup({
  description: "User permissions",
  name: "user",
  root: "permission",
})
// Assign all inherit slashes to the subgroup
@SlashGroup("user", "permission")
class UserPermission {
  @Slash({ description: "get" })
  get() {
    // ...
  }

  @Slash({ description: "set" })
  set() {
    // ...
  }
}
```

```ts
@Discord()
// Create a sub group
@SlashGroup({
  description: "Role permissions",
  name: "role",
  root: "permission",
})
// Assign all inherit slashes to the subgroup
@SlashGroup("role", "permission")
class RolePermission {
  @Slash({ description: "get" })
  get() {
    // ...
  }

  @Slash({ description: "set" })
  set() {
    // ...
  }
}
```
