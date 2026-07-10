# GPA Calculator

A modern and easy-to-use GPA calculator designed for university students to calculate both **module GPA** and **overall GPA (CGPA)** accurately.

The application supports cumulative GPA calculations using total credits and total grade points, ensuring correct results even when semester or yearly credit loads differ.

## 🌐 Live Demo

<a href="https://unigpa.vercel.app">
  <img src="https://img.shields.io/badge/🚀%20Visit%20UniGPA-F88A22?style=for-the-badge&logo=vercel&logoColor=white" alt="UniGPA">
</a>


## Screenshots

### Module GPA Calculator
![Module GPA Calculator](public/screenshots/gpacalc1.jpg)

### Overall GPA Calculator
![Overall GPA Calculator](public/screenshots/gpacalc2.jpg)


## Features

- Module-based GPA calculator
- Overall GPA / CGPA calculator
- Instant calculations
- Fully responsive design
- Modern dark UI
- Accurate weighted GPA calculations


## GPA Formulas

### Module GPA

```text
GPA = Total Grade Points ÷ Total Credits
````

### Overall GPA (CGPA)

```text
CGPA = Total Cumulative Grade Points ÷ Total Cumulative Credits
```

The overall GPA is a **weighted average**, not a simple average of yearly or semester GPAs. Using cumulative totals ensures accurate results even when credit loads vary. 

## Tech Stack

* React 18
* TypeScript
* Create React App (`react-scripts`)
* Tailwind CSS
* PostCSS
* Autoprefixer

## Example

```text
Cumulative Credits      : 60
Cumulative Grade Points : 201

CGPA = 201 ÷ 60
CGPA = 3.35
```

## Purpose

This project was built to provide students with a simple, reliable, and visually appealing way to calculate GPA and CGPA without manually performing weighted calculations.


## License

This project is licensed under the MIT License.


