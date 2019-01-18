// Creates a new processed event and adds it to the database
// Currently only trigger code 4 (movement stop event/Bin opened) is implemented

exports.createProcessedEvent = async (message, models, moment) => {

	const cooldown = 60;
	// Trigger code 4 stands for movement stop
	if (Number(message.decoded_payload.trigger_code) == 4) {
		try {
			console.log("Event triggercode = 4");
			var time = moment.unix(message.meta.time + cooldown).format();
			var time2 = moment.unix(message.meta.time - cooldown).format();
			console.log("time between ", time2, "  and  ", time)
			// Finds the sensorbin with deviceId
			const sensorbin = await models.sensorbin.findOne({
				attributes: ['trashbinId'],
				where: {
					touchtagDevEui: message.meta.device
				}
			});

			console.log("Sensorbin: ", sensorbin.dataValues);

			// Creates a new processedevent if it doesn't exist already
			// If another event exists between eventtime +/- cooldown finds it instead of creating a new one
			const event = await models.processedevent.findOrCreate({
				where: {
					trashbinId: sensorbin.dataValues.trashbinId,
					event_time: {
						"$between": [time2, time]
					}
				},
				defaults: {
					packet_hash: message.meta.packet_hash,
					event_type: "Bin opened",
					event_time: moment.unix(message.meta.time),
					trashbinId: sensorbin.dataValues.trashbinId
				}
			});

			// If event was not found it is now created
			if (event[0]._options.isNewRecord) {
				models.processedevent.findOne({
					where: {
						packet_hash: message.meta.packet_hash
					},
					include: [
						{ model: models.trashbin, attributes: ['id'] },
					],
				});
			}
			else {
				console.log("Didn't create event because cooldown not done.")
			}
		} catch (e) {
			console.log("Error creating processed event: ", e)
		}
	}
	else {
		console.log("Nothing interesting happens")
	}
}