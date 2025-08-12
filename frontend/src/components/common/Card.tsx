import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import cardImage from '../../assets/pexels-danny-meneses-340146-943096.jpg'

export default function ActionAreaCard() {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={cardImage}
          alt="job"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Software Developer
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
            Saepe temporibus officia quaerat vitae dolor totam pariatur laboriosam, 
            sequi sed, laudantium doloremque recusandae ipsam reprehenderit soluta quae corrupti, 
            dolores eius exercitationem?
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
