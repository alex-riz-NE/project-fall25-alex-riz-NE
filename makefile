# 1- run to fetch given mental health concepts and ids from the OMOP database
conditon_data:
	python src/get_condition_ids.py

# 2- run to create the cohort including the aphasia flag
cohort:
	python src/create_cohort.py

# 3- run to get a look into the cohort data
EDA:
	python src/EDA.py

# 4 - run to get all condition flags
conditon_flags:
	python src/create_condition_flags.py

# 5 - run to medicine counts and polypharmacy counts
polypharmacy_flags:
	python src/create_polypharmacy_flags.py

# 6 - run to create a pairwise comparison and a chord graph
visualize_flags:
	python src/flag_visualizations.py

# Runs all 
all: 
	make conditon_data 
	make cohort 
	make conditon_flags 
	make polypharmacy_flags
	make visualize_flags
	make clean


#### Cleaning
clean_images:
	rm -f data/*.{jpg,jpeg,png}
clean_csv:
	rm -f data/*.csv

clean_html:
	rm -f data/*.html
clean:
	make clean_images
	make clean_csv
	make clean_html

