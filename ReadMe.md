
# Introduction

This repository contains different librairies that can be used within Google AppScript (gas) projects.
See [gas-projects-template](https://github.com/bjbfr/gas-projects-template) for a starter for such projects.

## Hierarchy

```mermaid
---
title: Namespaces Hierarchy
---
flowchart TB
    templating --> fs
    fs --> ui
    spreadsheet & ui & fs --> utils

    templating & spreadsheet & fs & properties & ui & utils --> unittest

    spreadsheet --> obj & cmp

    subgraph  
        direction TB
        unittest --> cmp  
        cmp  --> obj & typing
    end
```
