vals = c(0, 1000, 2000, 3000, 4000)
shift_vals = vals

delay_vec = c(rep(vals[1], 12), rep(vals[2], 12), 
              rep(vals[3], 12), rep(vals[4], 13), 
              rep(vals[5], 13))

delay_mat = matrix(delay_vec)

for (i in (length(vals)-1):1) {
  shift_vals = c(shift_vals[-1], shift_vals[1])
  delay_mat = cbind(delay_mat, c(rep(shift_vals[1], 12), rep(shift_vals[2], 12), 
                           rep(shift_vals[3], 12), rep(shift_vals[4], 13), 
                           rep(shift_vals[5], 13)))
}
delay_df = data.frame(delay_mat)

data = read.csv("~/Documents/Graduate Files/ChangeBlindness/FChange/fcb02/main/Input/ROIs.csv")

data = cbind(data, matrix(1, nrow=621, ncol = length(vals)))

unique_images = unique(data$first_image)

for (i in 1:length(unique_images)) {
  data[which(data$first_image == unique_images[i]),as.character(1:length(vals))] = delay_df[i,]
}

names(data)[(ncol(data)-length(vals)+1):ncol(data)] = paste0('delay',1:length(vals))

write.csv(data, '~/Documents/Graduate Files/ChangeBlindness/FChange/fcb02/main/Input/ROIs_w_delay.csv', row.names = FALSE)
