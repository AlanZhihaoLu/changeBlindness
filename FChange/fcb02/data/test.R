data = read.csv('fcb02-pilot_2021_10_01.csv')
data = data[1:63,]


boxplot(data$rt ~ data$change_onset_alt)
